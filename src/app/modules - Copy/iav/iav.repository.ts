import {BaseRepository} from "../BaseRepository";
import iavModel from "./iav.model";
import { IIav } from "./iav.types";
import { ClientSession } from "mongoose";
import rapPriceModel from "../rap-price/rap-price.model";
import { IRapPrice } from "../rap-price/rap-price.types";
import transactionModel from "../transaction/transaction.model";
import skuModel from "../sku/sku.model";
import {ISku, skuStoneStatusEnum} from "../sku/sku.types";
import clientPriceModel from "../client-price/client-price.model";
import transactionIavChangeModel from "../transaction/iav-change/iav-change.model";
import userModel from "../user/user.model";
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import {IUser, IUserNested} from "../user/user.types";
import mongoose, {Types} from "mongoose";
import { Enum } from "../../constants/Enum";
import {Texts} from "../../constants"
import companyClientSettingModel from "../companyClientSetting/companyClientSetting.model";


export class IavRepository extends BaseRepository<IIav> {
    constructor () {
        super(iavModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<IUserNested[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
        };

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            const {key, value} = await JSON.parse(sorter)
            sort = {[key] : value}
        }
        else sort = {createdAt: -1};

        // if(search){
        //     search = JSON.parse(search)
        //     const _S = {$regex: search, $options: "i"}
        //     secondCond['$or'] = [
        //         {'firstName': _S}, {'lastName': _S}, {'email': _S}, {'altEmail': _S}, {'phone': _S}, {'contacts.name': _S}, {'addressId.address1': _S},
        //         {'addressId.address2': _S}, {'addressId.city': _S}, {'addressId.state': _S}, {'addressId.country': _S}, {'addressId.zipCode': _S},
        //     ]
        // }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            // for(const {key: k, value: v} of filters) {
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const aggregate = [
            // {$match: cond},
            {$lookup: {from: 'clientprices', localField: 'clientPriceId', foreignField: '_id', as: 'clientPriceId'}},
            {$unwind: {path: "$clientPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'rapprices', localField: 'rapPriceId', foreignField: '_id', as: 'rapPriceId'}},
            {$unwind: {path: "$rapPriceId", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
        ]
        const sCond = [ {$match: secondCond}, {$project: projection},]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async transactionCreate( transactionBody: any, cond:any, session: ClientSession) : Promise<any> {    
        let rapaport: IRapPrice|null = await rapPriceModel.findOne({}).sort({createdAt: -1})
        let companyId = await userModel.findOne({_id: transactionBody.createdBy}, 'companyId')
        transactionBody =  {...transactionBody, rapaportDate: rapaport?.createdAt, companyId: companyId?.companyId}
        let [ transaction, sku ] = await Promise.all([
            transactionIavChangeModel.create([transactionBody], {session}).then(transaction => transaction[0]),
            skuModel.find({...cond}).populate([{path: "iavId"}])
        ]) 
        // console.log(sku);
        return {transaction, sku}
    }

    async findRap(sku: ISku, calcWeight: number):  Promise<any>  {
        let [ price, clientPrice ] = await Promise.all([
            rapPriceModel.aggregate([
                { '$match': { 'weightRange.fromWeight': { '$lte': calcWeight }, 'weightRange.toWeight': { '$gte': calcWeight }, 'shape': sku.labShape, 'clarity': sku.clarity, 'color': sku.colorCategory } },
                { '$sort': { '_id': -1 } }, { '$limit': 1 }]),
            clientPriceModel.find({skuId: sku._id}).sort({createdAt: -1})
        ])
        return {price, clientPrice}
    }

    async update( transaction: any, iav:any, session: ClientSession):  Promise<void>  {
        let transactionData, iavData
        transactionData = await transactionIavChangeModel.findOneAndUpdate({transactionId: transaction.transactionId}, transaction, {new: true, session})
        if(iav && iav.length > 0){            
            iavData = await iavModel.create(iav,{session})
            await this.updateSku(iavData, session)
        } 
    }

    async updateSku (iav: any, session: ClientSession):  Promise<void> {
        for (const item of iav) {
            if(item.status === "PENDING") await skuModel.findOneAndUpdate({_id: item.skuId}, {iavId: item._id, stoneStatus: skuStoneStatusEnum.PRICE_CHANGED}, {session})
            else await skuModel.findOneAndUpdate({_id: item.skuId}, {iavId: item._id}, {session})
        } 
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}, secondCond: any = {}
        //@ts-expect-error
        if(user.roleId.shortDescription != 'SPACECODEADMIN') secondCond['skuId.companyId'] = mongoose.Types.ObjectId(user.companyId as string);

        let data = await iavModel.aggregate([
            { $match: { "isDeleted": false } },
            { $lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
            { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'labs', localField: 'skuId.labsId', foreignField: '_id', as: 'skuId.labsId' } },
            { $unwind: { path: "$skuId.labsId", preserveNullAndEmptyArrays: true } },
            { $match: {...secondCond}},
            { $lookup: { from: 'companies', localField: 'skuId.companyId', foreignField: '_id', as: 'skuId.companyId' } },
            { $unwind: { path: "$skuId.companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'rapprices', localField: 'rapPriceId', foreignField: '_id', as: 'rapPriceId' } },
            { $unwind: { path: "$rapPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'clientprices', localField: 'clientPriceId', foreignField: '_id', as: 'clientPriceId' } },
            { $unwind: { path: "$clientPriceId", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: null,
                    "uniqueWeight": { "$addToSet": "$skuId.weight" },
                    "color": { "$addToSet": "$skuId.colorCategory" },
                    "company": { "$addToSet": "$skuId.companyId" },
                    "status": { "$addToSet": "$skuId.stoneStatus" },
                    "shape": { "$addToSet": "$skuId.shape" },
                    "clarity": { "$addToSet": "$skuId.clarity" },
                    "colorType": { "$addToSet": "$skuId.colorType" },
                    "labs": { "$addToSet": "$skuId.labsId" },
                    "uniqueIav": { "$addToSet": "$iav" },
                    "uniquePwv": { "$addToSet": "$pwv" },
                    "uniqueDrv": { "$addToSet": "$drv" },
                    "uniqueRapPrices": { "$addToSet": "$rapPriceId.price" },
                    "uniqueClientPrices": { "$addToSet": "$clientPriceId.price" },
                }
            },
            {
                $project: {
                    _id: 0, "company.name": 1, "company._id": 1, "labs.lab": 1, "uniqueWeight": 1,
                    "color": 1, "status": 1, "shape": 1, "clarity": 1, "colorType": 1, "uniqueIav": 1, "uniquePwv": 1,
                    "uniqueDrv": 1, "uniqueRapPrices": 1, "uniqueClientPrices": 1
                }
            }
        ]).then(data => data[0])

        return data
    }  

    updateStatus = async (body: any, user: IUser['_id']): Promise<IIav|null> => {
        let skuData: ISku|null
        let iav = await iavModel.findOneAndUpdate({_id: body._id}, {status: body.status, updatedBy: user}, {new: true}).populate("skuId")
        console.log(iav, "vjk");
        
        if(body.status === "APPROVED"){
            //@ts-expect-error
            let companyClientSetting = await companyClientSettingModel.findOne({companyId: iav?.skuId?.companyId}).select({"companyId":1, "diamondMatchRegistration": 1})
            if(companyClientSetting?.diamondMatchRegistration) await skuModel.findOneAndUpdate({_id: iav?.skuId, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.APPROVED, stoneRegistration: true, updatedBy: user})
            else await skuModel.findOneAndUpdate({_id: iav?.skuId, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.COLLATERAL_READY, stoneRegistration: false, updatedBy: user})
        }
        else skuData = await skuModel.findOneAndUpdate({_id: iav?.skuId, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.REJECTED, updatedBy: user})
        return iav
    }

    updateEffectiveDate = async (session: ClientSession): Promise<void> => {
        const start = new Date(),end = new Date();  
        start.setHours(0,0,0,0);  
        end.setHours(23,59,59,999);
        console.log(start, "========", end);
        console.log("=======================****======================");
        console.log("=======================****======================");
        console.log("=======================****======================");
        console.log("=======================****======================");
        console.log("=======================****======================");
                    
        let iavData = await iavModel.aggregate([
            {$match: { $and: [ { effectiveDate: { $gte: start } }, { effectiveDate: { $lte: end } } ] }},
            {$lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },{ $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } }
        ]);
        
        let check = iavData.map(async iav => {
            if(iav._id !== iav.skuId.iavId) await skuModel.findOneAndUpdate({_id: iav.skuId._id, isDeleted:false},{iavId: iav._id}, {session})
        })
        await Promise.all(check)
    }
}