import {BaseRepository} from "../BaseRepository";
import activityModel from "./activity.model"
import { IActivity } from "./activity.types";
import mongoose, {Types} from "mongoose";
import {IIndexProjection} from "../../interfaces/IRepository";
import { IUser } from "../user/user.types";
import userModel from "../user/user.model";
import { Texts } from "../../constants";
import deviceModel from "../device/device.model";

export class ActivityRepository extends BaseRepository<IActivity> {
    constructor () {
        super(activityModel);
    }

    index = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize, column}: any): Promise<object[]> =>
    {
        let cond: {[p: string]: string|boolean|Types.ObjectId|{$in: any[]}|{$gte: any}|{$lte: any}} = {'isDeleted': false};
        let secondCond: {[p: string]: string|boolean|Types.ObjectId|{$in: any[]}|{$gte: any}|{$lte: any}|{[q: string]: {$regex: string, $options: "i"}}[]} = {     //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
            // 'companyId.isDeleted': false,
        };
        let sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0, 'userId.password': 0}, status: any = []

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            //const {key: k, value: v} = await JSON.parse(sorter)
            let {key: k, value: v} = await JSON.parse(sorter)
            if(v=='asc') v=1;
            if(v=='desc') v=-1;
            sort = {[k] : v}
        }
        else sort = {createdAt: -1, updatedAt: -1};

        if(search){
            search = JSON.parse(search)
            const _S: {$regex: string, $options: "i"} = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.rfId.rfid': _S}, {'skuId.clientRefId': _S}, {'labsId.labReportId': _S}]
        }
        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(({key:k, value:v}: {k: string, v: string|string[]|number[]|(Types.Object)[]}) => {
                if(k === 'startDate' || k === 'endDate') {
                    //@ts-expect-error
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    //@ts-expect-error
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    //@ts-expect-error
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k==='weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k==='groupBy' && v instanceof Array) {v.forEach((val: any, i: number) => {
                    if(val==='stoneStatus') status.push('ARRIVAL', 'TRANSIT', 'CONSIGNMENT', 'APPROVED', 'REJECTED', 'MISSING', 'SOLD', 'REMOVED') 
                    else if(val==='rfIdStatus') status.push('IN', 'OUT', 'INSTOCK')
                    else if(val==='collateralStatus') status.push('COLLATERAL IN', 'COLLATERAL OUT')
                    cond['status'] = {$in: status}
                })}
                else if(k==='groupBy') {
                    if(v==='stoneStatus') cond['status'] = {$in : ['ARRIVAL', 'TRANSIT', 'CONSIGNMENT', 'APPROVED', 'REJECTED', 'MISSING', 'SOLD', 'REMOVED']}
                    else if(v==='rfIdStatus') cond['status'] = {$in: ['IN', 'OUT', 'INSTOCK']}
                    else if(v==='collateralStatus') cond['status'] = {$in: ['COLLATERAL IN', 'COLLATERAL OUT']}
                }
                else if(k==='iavId.drv' || k==='iavId.iav' || k==='iavId.pwv' || k==='skuId.weight') secondCond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k.includes(".") && k.includes("_id") && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k.includes("_id")) secondCond[k] = mongoose.Types.ObjectId(v as string)
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

        let aggregate = [
            {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}},
            {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'rfids', localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId'}},
            {$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true}},
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
            { $lookup: { from: deviceModel.collection.name, localField: 'skuId.deviceId', foreignField: '_id', as: 'skuId.deviceId' } }, { $unwind: { path: "$skuId.deviceId", preserveNullAndEmptyArrays: true } },

        ]
        const sCond = [
            {$unset: ["userId.password", "createdBy.password", "updatedBy.password"]},
            {$match: secondCond}, {$project: projection},
        ]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        //need to add these conditions
        let cond: any = {}        
        // @ts-expect-error
        if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);
                
        let data = await activityModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            // { $match: {  "isDeleted": false } },
            { $lookup: { from: 'labs', localField: 'labsId', foreignField: '_id', as: 'labsId' } },
            { $unwind: { path: "$labsId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
            { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'devices', localField: 'skuId.deviceId', foreignField: '_id', as: 'deviceId' } },
            { $unwind: { path: "$deviceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'iavs', localField: 'iavId', foreignField: '_id', as: 'iavId' } },
            { $unwind: { path: "$iavId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'rapprices', localField: 'iavId.rapPriceId', foreignField: '_id', as: 'rapPriceId' } },
            { $unwind: { path: "$rapPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'clientprices', localField: 'iavId.clientPriceId', foreignField: '_id', as: 'clientPriceId' } },
            { $unwind: { path: "$clientPriceId", preserveNullAndEmptyArrays: true } },
            { $set: { "iavId.rapPriceId": "$rapPriceId" } },
            { $set: { "skuId.deviceId": "$deviceId" } },
            { $set: { "iavId.clientPriceId": "$clientPriceId" } },
            { $unset: ["rapPriceId", "clientPriceId", "deviceId"] },
            { $addFields: {"companyId.sorted": {$toLower: "$companyId.name"}}},
            {
                $group: {
                    _id: null,
                    "uniqueWeight": { "$addToSet": "$skuId.weight" },
                    "color": { "$addToSet": "$skuId.colorCategory" },
                    "company": { "$addToSet": "$companyId" },
                    "status": { "$addToSet": "$status" },
                    "shape": { "$addToSet": "$skuId.shape" },
                    "clarity": { "$addToSet": "$skuId.clarity" },
                    "colorType": { "$addToSet": "$skuId.colorType" },
                    "labs": { "$addToSet": "$labsId" },
                    "uniqueIav": { "$addToSet": "$iavId.iav" },
                    "uniquePwv": { "$addToSet": "$iavId.pwv" },
                    "uniqueDrv": { "$addToSet": "$iavId.drv" },
                    "uniqueRapPrices": { "$addToSet": "$iavId.rapPriceId.price" },
                    "uniqueClientPrices": { "$addToSet": "$iavId.clientPriceId.price" },
                    "devices": { "$addToSet": "$skuId.deviceId" }
                }
            },
            {
                $project: {
                    _id: 0, "company.name": 1, "company._id": 1, "company.sorted": 1, "labs.lab": 1, "uniqueWeight": 1,
                    "color": 1, "status": 1, "shape": 1, "clarity": 1, "colorType": 1, "uniqueIav": 1, "uniquePwv": 1,
                    "uniqueDrv": 1, "uniqueRapPrices": 1, "uniqueClientPrices": 1, "devices.name": 1, "devices._id": 1
                }
            }
        ]).then(data => data[0])

        return data
    }  
}