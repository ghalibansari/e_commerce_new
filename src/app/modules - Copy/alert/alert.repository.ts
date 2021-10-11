import {BaseRepository} from "../BaseRepository";
import alertModel from "./alert.model";
import {IAlert} from "./alert.types";
import userModel from "../user/user.model";
import companyModel from "../company/company.model";
import {Errors} from "../../constants";
import alertMasterModel from "../alert-master/alert-master.model";
import {ICond, IIndexBC, IIndexFilters, IIndexParam, IIndexProjection, ISort} from "../../interfaces/IRepository";
import mongoose, {Types} from "mongoose";
import {ICounter} from "../baseTypes";
import { IUser } from "../user/user.types";


export class AlertRepository extends BaseRepository<IAlert> {
    constructor () {
        super(alertModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<object[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false};
        let secondCond: any = {} //Todo add isDeleted condition here in every table
        let sort: ISort = {}, projection: IIndexProjection = {"userId.password": 0}

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            const {key: k, value: v}: ISort = await JSON.parse(sorter)
            sort = {[k] : v}
        }
        else sort = { createdAt: -1, updatedAt: -1}

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                // else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v)
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
            {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}},
            {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'userId', foreignField: '_id', as: 'userId'}},
            {$unwind: {path: "$userId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'alertmasters', localField: 'alertId', foreignField: '_id', as: 'alertId'}},
            {$unwind: {path: "$alertId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
            // {$unset: ["userId.password"]}
        ]
        const sCond = [{$match: secondCond}, {$project: projection}, {$unset: ["userId.password"]}]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    create = async (newData: IAlert): Promise<IAlert> => {
        await this.checkIds(newData)
        return await alertModel.create(newData)
    }

    update = async (newData: IAlert): Promise<IAlert|null> => {
        await this.checkIds(newData)
        return alertModel.findByIdAndUpdate(newData._id, newData, {new: true})
    }

    countBySkuCompanyId = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam, counter: ICounter[], companyId: string): Promise<any> => {
        //@ts-expect-error
        let cond: ICond = {isDeleted: false};
        let secondCond: any = {} //Todo add isDeleted condition here in every table

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === 'companyId') {}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        let aggregate = [
            {$match: cond},
            {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}},
            {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'userId', foreignField: '_id', as: 'userId'}},
            {$unwind: {path: "$userId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'alertmasters', localField: 'alertId', foreignField: '_id', as: 'alertId'}},
            {$unwind: {path: "$alertId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$match: secondCond},
        ]

        let aggregateTotal: any = [
            {$match: {isDeleted: false}},
            {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}},
            {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
        ]

        if(companyId) {
            aggregate.push({$match: {'skuId.companyId': mongoose.Types.ObjectId(companyId)}});
            aggregateTotal.push({$match: {'skuId.companyId': mongoose.Types.ObjectId(companyId)}});
        }

        let count: any = {}

        await alertModel.aggregate([...aggregateTotal, {$count: 'total'}]).then(([{total}]: any) => count['total'] = total)

        if(!counter.length) await alertModel.countDocuments({ isDeleted: false }).then((value: Number) => count['total'] = value)
        let countMap = counter.map(async counter => {
            await alertModel.aggregate([...aggregate, {$match :{[counter.key]: counter.value}}, {$count: 'count'}])
                .then((value: any) => {
                    if (count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
                    count[`${counter.key}`][`${counter.value}`] = value[0]?.count ?? 0
                })
        })
        await Promise.all(countMap)
        return {count}
    }

    async checkIds({userId, alertId, companyId}: IAlert): Promise<void|never> {
        const [userIdData, alertMasterIdData] = await Promise.all([
            await userModel.findOne({_id: userId, isDeleted: false}, '_id'),
            await alertMasterModel.findOne({_id: alertId, isDeleted: false}, '_id alertType'),
            //await companyModel.findOne({_id: companyId, isDeleted: false}, '_id')
        ])
        if(!alertMasterIdData?._id) throw new Error(Errors.INVALID_ALERT_ID)
        //if(!companyIdData?._id) throw new Error(Errors.INVALID_COMPANY_ID)
        if(alertMasterIdData.alertType === 'USERGENERATED') if(!userIdData?._id) throw new Error(Errors.INVALID_USER_ID)
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}        
        //@ts-expect-error
        if(user.roleId.shortDescription != 'SPACECODEADMIN') cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);
                
        let data = await alertModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            { $lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
            { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'labs', localField: 'skuId.labsId', foreignField: '_id', as: 'skuId.labsId' } },
            { $unwind: { path: "$skuId.labsId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'companies', localField: 'skuId.companyId', foreignField: '_id', as: 'skuId.companyId' } },
            { $unwind: { path: "$skuId.companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'devices', localField: 'skuId.deviceId', foreignField: '_id', as: 'skuId.deviceId' } },
            { $unwind: { path: "$skuId.deviceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'iavs', localField: 'skuId.iavId', foreignField: '_id', as: 'skuId.iavId' } },
            { $unwind: { path: "$skuId.iavId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'rapprices', localField: 'skuId.iavId.rapPriceId', foreignField: '_id', as: 'skuId.iavId.rapPriceId' } },
            { $unwind: { path: "$skuId.iavId.rapPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'clientprices', localField: 'skuId.iavId.clientPriceId', foreignField: '_id', as: 'skuId.iavId.clientPriceId' } },
            { $unwind: { path: "$skuId.iavId.clientPriceId", preserveNullAndEmptyArrays: true } },
            { $addFields: {"skuId.companyId.sorted": {$toLower: "$skuId.companyId.name"}}},
            {
                $group: {
                    _id: null,
                    "uniqueWeight": { "$addToSet": "$skuId.weight" },
                    "color": { "$addToSet": "$skuId.colorCategory" },
                    "company": { "$addToSet": "$skuId.companyId" },
                    "status": { "$addToSet": "$skuId.movementStatus" },
                    "shape": { "$addToSet": "$skuId.shape" },
                    "clarity": { "$addToSet": "$skuId.clarity" },
                    "colorType": { "$addToSet": "$skuId.colorType" },
                    "labs": { "$addToSet": "$skuId.labsId" },
                    "uniqueIav": { "$addToSet": "$skuId.iavId.iav" },
                    "uniquePwv": { "$addToSet": "$skuId.iavId.pwv" },
                    "uniqueDrv": { "$addToSet": "$skuId.iavId.drv" },
                    "uniqueRapPrices": { "$addToSet": "$skuId.iavId.rapPriceId.price" },
                    "uniqueClientPrices": { "$addToSet": "$skuId.iavId.clientPriceId.price" },
                    "devices": { "$addToSet": "$skuId.deviceId" },
                    "notificationStatus": {"$addToSet": "$status"}
                }
            },
            {
                $project: {
                    _id: 0, "company.name": 1, "company._id": 1, "company.sorted":1, "labs.lab": 1, "uniqueWeight": 1,
                    "color": 1, "status": 1, "shape": 1, "clarity": 1, "colorType": 1, "uniqueIav": 1, "uniquePwv": 1,
                    "uniqueDrv": 1, "uniqueRapPrices": 1, "uniqueClientPrices": 1, "devices.name": 1, "devices._id": 1,
                    "notificationStatus": 1
                }
            }
        ]).then(data => data[0])

        return data
    }
}