import {BaseRepository} from "../BaseRepository";
import transitModel from "./transit.model";
import {ITransit} from "./transit.types";
import skuModel from "../sku/sku.model";
import mongoose, {ClientSession} from 'mongoose';
// import transactionTransitModel from "../transaction/transit/transit.model";
import userModel from "../user/user.model";
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import { IUser } from "../user/user.types";
import { Texts } from '../../constants';
import { skuStoneStatusEnum } from "../sku/sku.types";

export class TransitRepository extends BaseRepository<ITransit> {
    constructor () {
        super(transitModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<any[]> => {
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
        else sort = { createdAt: -1, updatedAt: -1};

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuIds.rfId.rfid': _S}, {'skuIds.labsId.labReportId': _S}, {'skuIds.clientRefId': _S}, {'skuIds.infinityRefId': _S}]
        }

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
            // {$lookup: {from: 'skus', localField: 'skuIds', foreignField: '_id', as: 'skuIds'}},
            // {$lookup: {from: 'rfids', localField: 'skuIds.rfId', foreignField: '_id', as: 'skuIds.rfId'}}, {$unwind: {path: "$skuIds.rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}}, {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond}, {$project: projection}, {$unset: 'createdBy.password'}
        ]
        const sCond = [{$match: secondCond}, {$project: projection}, {$unset: 'createdBy.password'}]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
    }

    async create(body: any, transactionBody: any, user: any, session:ClientSession): Promise<ITransit>{
        await this.checkIds(body)
        let companyId = await userModel.findOne({_id: body.createdBy}, 'companyId')
        transactionBody =  {...transactionBody, companyId: companyId?.companyId}
        // let [transaction, , transit] = await Promise.all([
        let [ , transit] = await Promise.all([
            // transactionTransitModel.create([transactionBody], {session}).then(transaction => transaction[0]),
            skuModel.updateMany({"_id": body.skuIds},{ stoneStatus :skuStoneStatusEnum.TRANSIT, updatedBy: user.createdBy}, {session}),
            transitModel.create([body], {session}).then(transit => transit[0])
        ])
        // transaction.skuIds = body.skuIds
        // await transactionTransitModel.findOneAndUpdate({transactionId:transaction.transactionId},transaction,{session})
        return transit // have to get object
    }

    async update(body: any, session:ClientSession): Promise<ITransit|null>{
        await this.checkIds(body)
        return transitModel.findOneAndUpdate({_id: body._id}, body, {new: true, session});
    }

    async checkIds({skuIds}: ITransit): Promise<void|never> {
        let skuIdData = skuIds.map( id =>  skuModel.findById(id).select('_id').lean())
        await Promise.all(skuIdData).then(skuIdData => skuIdData.forEach(sku => {if(!sku?._id) throw new Error("Invalid skuId")}) )        
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}        
        // @ts-expect-error
        if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        let data = await transitModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: null,
                    "companies": {"$addToSet": "$companyId"},
                }
            },
            {
                $project: {
                    _id: 0, "companies._id": 1, "companies.name":1, "device": 1               
                }
            }
        ]).then(data => data[0])

        return data
    } 
}