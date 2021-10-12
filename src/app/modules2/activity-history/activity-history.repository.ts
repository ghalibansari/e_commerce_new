import {BaseRepository} from "../BaseRepository";
import mongoose, {ClientSession, Types} from "mongoose";
import {IActivityHistory} from "./activity-history.types";
import activityHistoryModel from "./activity-history.model";
import activityModel from "../activity/activity.model";
import moment from "moment";
import {IIndexProjection} from "../../interfaces/IRepository";

export class ActivityHistoryRepository extends BaseRepository<IActivityHistory> {
    constructor () {
        super(activityHistoryModel);
    }

    index = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0, 'userId.password': 0}
        let secondCond: any = {}    //Todo add isDeleted condition here in every table

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = { [`${sorter.key}`] : `${sorter.value}`}
        }
        else sort = { createdAt: -1, updatedAt: -1};

        // if(search && search[0]=='{' && search[search.length-1]=='}'){
        //     search = JSON.parse(search);
        //     if(search.key === 'rfId') secondCond['rfId.rfid'] = {$regex: search.value, $options: "i"}
        // }
        if(search){
            search = JSON.parse(search)
            const _S: {$regex: string, $options: "i"} = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.rfId.rfid': _S}, {'skuId.clientRefId': _S}, {'labsId.labReportId': _S}]
        }
        if(filters && filters[0]=='[' && filters[filters.length-1]==']'){
            filters = await JSON.parse(filters);
            filters.forEach(({key: k, value: v}: any) => {
                if(k === 'labsId.labReportId') secondCond[k] = v
                else if(k === 'weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k==='iavId.drv' || k==='iavId.iav' || k==='iavId.pwv') secondCond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }
        if(sliders && sliders[0]=='{' && sliders[sliders.length-1]=='}') {
            sliders = JSON.parse(sliders)
            if(sliders.weight) cond.weight = {"$gte": sliders.weight[0], "$lte": sliders.weight[1]}
            if(sliders.drv) secondCond['iavId.drv'] = {"$gte": sliders.drv[0], "$lte": sliders.drv[1]}
            if(sliders.iav) secondCond['iavId.iav'] = {"$gte": sliders.iav[0],"$lte": sliders.iav[1]}
            if(sliders.pwv) secondCond['iavId.pwv'] = {"$gte": sliders.pwv[0],"$lte": sliders.pwv[1]}
            if(sliders.labReportId) secondCond['labsId.labReportId'] = sliders.labReportId
            //@ts-expect-error
            if(sliders.parentId) secondCond['companyId.parentId'] = mongoose.ObjectId(sliders.parentId)
        }

        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        let aggregate = [
            {$match: cond},
            {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}},
            {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'userId', foreignField: '_id', as: 'userId'}},
            {$unwind: {path: "$userId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'labs', localField: 'labsId', foreignField: '_id', as: 'labsId'}},
            {$unwind: {path: "$labsId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'diamondmatches', localField: 'dmId', foreignField: '_id', as: 'dmId'}},
            {$unwind: {path: "$dmId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'iavs', localField: 'iavId', foreignField: '_id', as: 'iavId'}},
            {$unwind: {path: "$iavId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'rapprices', localField: 'iavId.rapPriceId', foreignField: '_id', as: 'iavId.rapPriceId'}},
            {$unwind: {path: "$iavId.rapPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'clientprices', localField: 'iavId.clientPriceId', foreignField: '_id', as: 'iavId.clientPriceId'}},
            {$unwind: {path: "$iavId.clientPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
            {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            {$match: secondCond},
            {$project: projection},
            {$unset: ["userId.password", "createdBy.password", "updatedBy.password"]}
        ]
        return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
    }

    activityHistory = async (days: string, session: ClientSession): Promise<void> => {  //Todo implement session here...
        const time = moment().subtract(days, 'days').format();
        //@ts-expect-error
        const activityData = await activityModel.find({createdAt: {$lt: time}}).batchSize(1000)
        await activityHistoryModel.insertMany(activityData, )
        await activityModel.deleteMany({_id: {$in: activityData}})
    }
}