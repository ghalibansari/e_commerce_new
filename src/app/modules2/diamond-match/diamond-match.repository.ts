import {BaseRepository} from "../BaseRepository";
import diamondMatchModel from "./diamond-match.model";
import {ICompany} from "../company/company.types";
import companyModel from "../company/company.model";
import skuModel from "../sku/sku.model";
import {ISku, skuCollateralStatusEnum, skuStoneStatusEnum} from "../sku/sku.types";
import {IDiamondMatch} from "./diamond-match.types";
import diamondMatchRuleModel from "../diamond-match-rule/diamond-match-rule.model";
import {IDiamondMatchRule} from "../diamond-match-rule/diamond-match-rule.types";
import mongoose, {ClientSession} from "mongoose";
import {IUser} from "../user/user.types";
import activityModel from "../activity/activity.model";
import {IActivity} from "../activity/activity.types";
import transactionDmModel from "../transaction/diamond-match/diamond-match.model";
import userModel from "../user/user.model";
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import deviceModel from "../device/device.model";
import {devices} from "../../socket"
import { Messages } from "../../constants";
import { ISuccessResponse } from "../../helper";
import { ErrorCodes } from "../../constants/ErrorCodes";
import {Types} from "joi";
import { diamondMatchJobs } from "../cron/cron.jobs";

//Todo interface
export class DiamondMatchRepository extends BaseRepository<any> {
    constructor () {
        super(diamondMatchModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<any> => {    //Todo need more optimization... worst response time...
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
        };
       /// secondCond["skuId.stoneRegistration"] = true

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            const {key, value} = await JSON.parse(sorter)
            sort = {[key] : value}
        }
        else sort = {createdAt: -1};

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.clientRefId': _S}, {'skuId.rfId.rfid': _S}]
        }
        // console.log(filters, "====================");
        
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
                // else if (k === 'companyId') secondCond['skuId.companyId'] = mongoose.Types.ObjectId(v as string)
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
            {$match: cond},
            {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}}, {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}}, {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'labs', localField: 'skuId.labsId', foreignField: '_id', as: 'skuId.labsId' }}, {$unwind: {path: "$skuId.labsId", preserveNullAndEmptyArrays: true }},
            {$lookup: {from: 'iavs', localField: 'skuId.iavId', foreignField: '_id', as: 'skuId.iavId' }}, {$unwind: {path: "$skuId.iavId", preserveNullAndEmptyArrays: true }},
            {$lookup: {from: 'rfids', localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId' }}, {$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true }},
            {$lookup: {from: 'rapprices', localField: 'skuId.iavId.rapPriceId', foreignField: '_id', as: 'skuId.iavId.rapPriceId'}}, {$unwind: {path: "$skuId.iavId.rapPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'clientprices', localField: 'skuId.iavId.clientPriceId', foreignField: '_id', as: 'skuId.iavId.clientPriceId'}}, {$unwind: {path: "$skuId.iavId.clientPriceId", preserveNullAndEmptyArrays: true}},
            {$match: secondCond}, {$project: projection},
        ]
        let header = {totalStone: 0, notMatched: 0, matched: 0, minimumThreshold: 0}
        // const {data, page} = await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize);
        // const min = await diamondMatchRuleModel.findOne({isDeleted: false}).sort({'param.threshold': 1})
        const [{data, page}, minimumThreshold, countHeader] = await Promise.all([
            await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize),
            await diamondMatchRuleModel.findOne({isDeleted: false}).select('param.threshold').sort({'param.threshold': 1}).lean(),
            await diamondMatchModel.aggregate([...aggregate, {$project: {status: 1}}])  //Todo bring count from db directly
        ])
        //@ts-expect-error
        header.minimumThreshold = minimumThreshold?.param?.threshold ?? 0
        header.totalStone = page.filterCount
        countHeader.forEach(({status}: any) => {if(status === 'NOTMATCHED') header.notMatched = header.notMatched + 1; else if(status === 'MATCHED') header.matched = header.matched + 1})
        return {header, page, data}
    }

    async simulateDm(companyId: ICompany['_id'], threshold: any): Promise<ISku[]|any> {
        let skuData: any = [];
        if(!threshold) threshold = 0;
        let populate = [{ path: "iavId" }, {path: 'rfId'}];
        let company = await companyModel.findOne({_id:companyId, isDeleted: false}).limit(threshold).select('_id')         
        if(company?._id) return skuModel.find({companyId, stoneRegistration:true,collateralStatus: skuCollateralStatusEnum.COLLATERAL_IN, stoneStatus: {$nin: [skuStoneStatusEnum.CONSIGNMENT, skuStoneStatusEnum.TRANSIT]}, isDeleted: false}).populate(populate);  // have to add movementStatus type
        // else return "Invalid companyId"
        else return skuData
    }

    async createsimulateData(body: any, transactionBody: any, simulateData: any, session: ClientSession): Promise<IDiamondMatch[]> {
        let dmRule:IDiamondMatchRule|null = await diamondMatchRuleModel.findOne({companyId: body.companyId,"param.premiumPercent" : body.premiumPercent,"param.premiumCycle": body.premiumCycle,
                "param.randomPercent":body.randomPercent, "param.regularCycle":body.regularCycle},{createAt: -1}).session(session) //  need to add threshold
        let dmData: IDiamondMatch[] = [] , skuIds: ISku['_id'][] = [], diamondMatchArray: IDiamondMatch[] = [], diamondMatch: any
        let listView = simulateData.listView.filter((simulateObj: any) => simulateObj.day === 1) 
        // console.log(listView, "===========listview "+listView.length);
              
        // for (const item of listView) {
        //     //@ts-expect-error
        //     dmData.push({skuId: item._id, companyId: item.companyId, diamondMatchRuleId: dmRule?._id, status: "NOTMATCHED", dmType: "AUTO", createdBy: body?.loggedInUser?._id, updatedBy: body?.loggedInUser?._id })
        //     skuIds.push(item._id)
        // }
        console.log(listView, "=============listView============");
        
        let diamondMatchCheck = listView.map(async (item: any) => {
            let dmData = await diamondMatchModel.findOne({skuId: item._id, status: "NOTMATCHED"})
            if(dmData){
                diamondMatch = await diamondMatchModel.findOneAndUpdate({_id: dmData._id}, {updatedBy: body?.loggedInUser?._id},{new: true, session})
                diamondMatchArray.push(diamondMatch)
            } 
            else{
                diamondMatch = await diamondMatchModel.create([{skuId: item._id, companyId: item.companyId, diamondMatchRuleId: dmRule?._id, status: "NOTMATCHED", dmType: "AUTO", createdBy: body?.loggedInUser?._id, updatedBy: body?.loggedInUser?._id }], {session})
                diamondMatchArray.push(...diamondMatch)
            } 
            skuIds.push(item._id)
        })
        await Promise.all(diamondMatchCheck)

        if(skuIds.length)
        {
            transactionBody.skuIds = skuIds;
            await transactionDmModel.create([transactionBody], {session});
        }
        return diamondMatchArray
        //await transactionDmModel.findOneAndUpdate({ transactionId: transaction.transactionId }, transaction, {session})
        // let registerDevice = await deviceModel.find({companyId: body.companyId, isDeleted: false});
        // for (const device of registerDevice) {
        //     let token = device?.token;
        //     if(token!=null && devices && devices[token]) devices[token].emit("refresh", "refresh the system");    
        // }
        // console.log("Data Size : "+dmData.length);
        // return await diamondMatchModel.insertMany(dmData, {session});
    }

    async create(transactionBody: any, skuIds: ISku['_id'][], loggedInUserId: IUser['_id'], session: ClientSession): Promise<ISuccessResponse> {
        let dmData: any = [], dm: any = {}, notRegisteredStones: ISku['_id'][] = [], registered: ISku['_id'][] = [], diamondMatchArray: any = [], diamondMatch: any
        let companyId = await userModel.findOne({_id: loggedInUserId}, 'companyId')
        transactionBody =  {...transactionBody, companyId: companyId?.companyId}
        let transaction: any = await transactionDmModel.create([transactionBody], {session}).then( transaction => transaction[0]);
        let skuData = await skuModel.find({_id: {$in: skuIds}, isDeleted: false})

        // for (let sku of skuData) {
        //     // await skuModel.findOne({ _id: item }).then(sku => { if (!sku?._id) throw new Error("Invalid skuId") })
        //     if(sku.stoneRegistration){
        //         registered.push(sku._id)
        //         dmData.push({skuId: sku._id, createdBy: loggedInUserId, updatedBy: loggedInUserId, companyId: sku.companyId})
        //     }
        //     else notRegisteredStones.push(sku._id)
        // }
        let diamondMatchCheck = skuData.map(async (sku: any) => {
            let dmData = await diamondMatchModel.findOne({skuId: sku._id, status: "NOTMATCHED"})
            console.log(dmData, "checking=============");
            
            if(sku.stoneRegistration){
                registered.push(sku._id)
                if(dmData){
                    diamondMatch = await diamondMatchModel.findOneAndUpdate({_id: dmData._id}, {updatedBy: loggedInUserId},{new: true, session})
                    diamondMatchArray.push(diamondMatch)
                } 
                else{
                    diamondMatch = await diamondMatchModel.create([{skuId: sku._id, createdBy: loggedInUserId, updatedBy: loggedInUserId, companyId: sku.companyId}], {session})
                    diamondMatchArray.push(...diamondMatch)
                } 
    
                // dmData.push({skuId: sku._id, createdBy: loggedInUserId, updatedBy: loggedInUserId, companyId: sku.companyId})
            }
             else notRegisteredStones.push(sku._id)


            // if(dmData){
            //     diamondMatch = await diamondMatchModel.updateMany({_id: dmData._id}, {updatedBy: body?.loggedInUser?._id},{new: true})
            //     diamondMatchArray.push(diamondMatch)
            // } 
            // else{
            //     await diamondMatchModel.create({skuId: item._id, companyId: item.companyId, diamondMatchRuleId: dmRule?._id, status: "NOTMATCHED", dmType: "AUTO", createdBy: body?.loggedInUser?._id, updatedBy: body?.loggedInUser?._id })
            //     diamondMatchArray.push(diamondMatch)
            // } 
            // skuIds.push(item._id)
        })
        await Promise.all(diamondMatchCheck)
        transaction.skuIds = registered;      
        await transactionDmModel.updateMany({ transactionId: transaction.transactionId }, transaction, {session})
        // let data = await diamondMatchModel.insertMany(dmData, {session});
        if(notRegisteredStones.length > 0) return {status: false, message:Messages.STONE_NOT_YET_REGISTERED, data: notRegisteredStones }
        else return {status: true,message: Messages.CREATE_SUCCESSFUL, data: diamondMatchArray}
    }

    async update(body: any, user: any, session: ClientSession): Promise<IDiamondMatch> {
        let skuData = await skuModel.findById({_id:body.skuId}).select('_id')
        if (!skuData?._id) throw new Error("Invalid deviceTypeId")
        await this.createActivity(body, user, session)
        console.log(body, "=======");
        let dm =await diamondMatchModel.findOneAndUpdate({_id: body._id, skuId:body.skuId, isDeleted: false},body, {new:true, session})
        let registerDevice = await deviceModel.find({companyId: body.loggedInUser.companyId, isDeleted: false});
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_DIAMOND_MATCH, message: "DiamondMatch with activity", data: null});    
        }
        if(!dm) throw new Error("invalid Id")
        return dm
    }

    async createActivity(body: any, user :any, session: ClientSession): Promise<IActivity|null> { 
        let skuData: ISku| null = await skuModel.findOne({_id:body.skuId})
        let dmId: any = await diamondMatchModel.findOne({skuId: body.skuId, $or: [ { status: "MATCHED" }, { status: "NOTMATCHED" } ] }).sort({createdAt: -1}).select('_id').lean()        
        if(!dmId) dmId = null
        let activityData = {companyId: skuData?.companyId, skuId: body.skuId, labsId: skuData?.labsId, iavId: skuData?.iavId,
            userId: user.createdBy, dmId, status: body.status, ...user}
        console.log(activityData);
        if(body?.comments) activityData = {...activityData, comments: body.comments}        
        let activity = await activityModel.create([activityData], {session}).then(activity => activity[0])
        return activity;
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}, secondCond: any = {}
        //@ts-expect-error
        if(user.roleId.shortDescription != 'SPACECODEADMIN') cond['skuId.companyId'] = mongoose.Types.ObjectId(user.companyId as string);
                
        let data = await diamondMatchModel.aggregate([
            { $match: { "isDeleted": false, ...cond } },
            { $lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
            { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'labs', localField: 'skuId.labsId', foreignField: '_id', as: 'skuId.labsId' } },
            { $unwind: { path: "$skuId.labsId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'devices', localField: 'skuId.deviceId', foreignField: '_id', as: 'skuId.deviceId' } },
            { $unwind: { path: "$skuId.deviceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'iavs', localField: 'skuId.iavId', foreignField: '_id', as: 'skuId.iavId' } },
            { $unwind: { path: "$skuId.iavId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'rapprices', localField: 'skuId.iavId.rapPriceId', foreignField: '_id', as: 'skuId.iavId.rapPriceId' } },
            { $unwind: { path: "$skuId.iavId.rapPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'clientprices', localField: 'skuId.iavId.clientPriceId', foreignField: '_id', as: 'skuId.iavId.clientPriceId' } },
            { $unwind: { path: "$skuId.iavId.clientPriceId", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: null,
                    "uniqueWeight": { "$addToSet": "$skuId.weight" },
                    "color": { "$addToSet": "$skuId.colorCategory" },
                    "company": { "$addToSet": "$companyId" },
                    "status": { "$addToSet": "$skuId.stoneStatus" },
                    "shape": { "$addToSet": "$skuId.shape" },
                    "clarity": { "$addToSet": "$skuId.clarity" },
                    "colorType": { "$addToSet": "$skuId.colorType" },
                    "labs": { "$addToSet": "$skuId.labsId" },
                    "uniqueIav": { "$addToSet": "$skuId.iavId.iav" },
                    "uniquePwv": { "$addToSet": "$skuId.iavId.pwv" },
                    "uniqueDrv": { "$addToSet": "$skuId.iavId.drv" },
                    "dmStatus": { "$addToSet": "$status"},
                    "uniqueRapPrices": { "$addToSet": "$skuId.iavId.rapPriceId.price" },
                    "uniqueClientPrices": { "$addToSet": "$skuId.iavId.clientPriceId.price" },
                    "devices": { "$addToSet": "$skuId.deviceId" }
                }
            },
            {
                $project: {
                    _id: 0, "company.name": 1, "company._id": 1, "labs.lab": 1, "uniqueWeight": 1,
                    "color": 1, "status": 1, "shape": 1, "clarity": 1, "colorType": 1, "uniqueIav": 1, "uniquePwv": 1,
                    "uniqueDrv": 1, "uniqueRapPrices": 1, "uniqueClientPrices": 1, "devices.name": 1, "devices._id": 1, "dmStatus": 1
                }
            }
        ]).then(data => data[0])

        return data
    }  

    async getUnique(companyId: ICompany['_id']): Promise<any> {
        // let data = await diamondMatchModel.find({status: "NOTMATCHED", isDeleted: false}).sort({createdAt:-1})
        // @ts-ignore
        companyId = mongoose.Types.ObjectId(companyId)
        let data = await diamondMatchModel.aggregate([
            {$match: {status: "NOTMATCHED", companyId, isDeleted: false}},
            {$sort: {createAt:-1}},
            {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}},
            {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'labs', localField: 'skuId.labsId', foreignField: '_id', as: 'skuId.labsId' }},
            {$unwind: {path: "$skuId.labsId", preserveNullAndEmptyArrays: true }},
            {$lookup: {from: 'iavs', localField: 'skuId.iavId', foreignField: '_id', as: 'skuId.iavId' }},
            {$unwind: {path: "$skuId.iavId", preserveNullAndEmptyArrays: true }},
            {$lookup: {from: 'rfids', localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId' }},
            {$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true }},
        ])
        
        let uniqueDm: any = [], array: any = []        
        for (const item of data) {
            if(array.includes(String(item.skuId._id))) continue
            array.push(String(item.skuId._id))
            uniqueDm.push(item)
        }
        console.log(data.length, "======>>>>>>> length");
        console.log(uniqueDm.length, "==========>>>>>>>> unique");
        
        return uniqueDm
    }

    async cancelDm(body: any, user: any, session: ClientSession): Promise<any> {
        // let diamondMatchCheck = body.diamondMatchIds.map(async (dimondMatchId: any) => {
        //     let dm =await diamondMatchModel.findOneAndUpdate({_id: dimondMatchId, isDeleted: false},{status: body.status, comments: body.comments}, {new:true, session})
        //     await this.createActivity(dm, user, session)
        //     // console.log(body, "=======");
        // })
        // await Promise.all(diamondMatchCheck)
        let dm =await diamondMatchModel.updateMany({_id: {$in: body.diamondMatchIds}, isDeleted: false},{status: body.status, comments: body.comments}, {new:true, session})
        return dm.nModified
    }
}
