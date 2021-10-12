import {BaseRepository} from "../BaseRepository";
import {IEvent} from "../events/events.types";
import rawActivityModel from "./raw-activity.model"
import {IRawActivity} from "./raw-activity.types";
import lo from "lodash"
import activityModel from "../activity/activity.model";
import alertModel from "../alert/alert.model";
import rfidModel from "../rfid/rfid.model";
import skuModel from "../sku/sku.model";
import userModel from "../user/user.model";
import {ISku} from "../sku/sku.types";
import {IUser, IUserNested} from "../user/user.types";
import alertMasterModel from "../alert-master/alert-master.model";
import {IAlert} from "../alert/alert.types";
import deviceModel from "../device/device.model";
// import { ClientSession } from "mongoose";
import {IAlertMaster} from "../alert-master/alert-master.types";
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
// import * as mongoose from "mongoose";
import mongoose, {ClientSession} from 'mongoose'
import {Texts} from "../../constants";
import {IDevice} from "../device/device.types";
import BusinessModel from "../business/business.model";
import companyModel from "../company/company.model";
import addressModel from "../address/address.model";
import roleModel from "../role/role.model";
import iavModel from "../iav/iav.model";
import rapPriceModel from "../rap-price/rap-price.model";
import clientPriceModel from "../client-price/client-price.model";
import labModel from "../lab/lab.model";


export class RawActivityRepository extends BaseRepository<IRawActivity> {
    constructor () {
        super(rawActivityModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<IUserNested[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort, projection: IIndexProjection = {password: 0}
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
            secondCond['$or'] = [{'transactionId': _S}, {'reader.serial': _S}, {'timestamp': _S}, {'companyId.name': _S}]
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
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'addresses', localField: 'addressId', foreignField: '_id', as: 'addressId'}},
            {$unwind: {path: "$addressId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'roles', localField: 'roleId', foreignField: '_id', as: 'roleId'}},
            {$unwind: {path: "$roleId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'user', foreignField: '_id', as: 'user'}}, {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'devices', localField: 'deviceId', foreignField: '_id', as: 'deviceId'}}, {$unwind: {path: "$deviceId", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
        ]
        const sCond = [{$match: secondCond}, {$project: projection},]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async findPrevious(match: any): Promise<IRawActivity|null> { 
        return rawActivityModel.findOne(match).sort({createdAt: -1});
    }

    async create(eventIn:IEvent,eventOut:IEvent,eventInventory: IEvent,body: any, session: ClientSession): Promise<IRawActivity> {
        let device_data: any = await deviceModel.findOne({ "serialNumber": body.reader.serial, "isDeleted": false }).sort({createdAt:-1})        
        if(!device_data?._id) throw new Error("device is not mentioned")
        body.deviceId = device_data?._id;
        body.companyId=device_data.companyId;
        if (body.action) {
            let businessObj: any = {
                createdBy: body.user, updatedBy: body.user, timestamp: body.timestamp,
                user: body.user, action: body.action, companyId: body.companyId
            }
            let skuData: any = await rfidModel.aggregate([
                { $match: { rfid: { $in: eventInventory.stones }, "isDeleted": false } },
                { $group: { _id: null, "skuIds": { "$addToSet": "$skuId" } } }
            ]).then(data => data[0])
            businessObj.skuIds = skuData.skuIds
            await BusinessModel.create([businessObj], {session});
        }
        let createIn = await this.createActivityData(eventIn, body, session)
        let createOut = await this.createActivityData(eventOut, body, session)        
        let createAlert = lo.concat(createIn.createAlertData, createOut.createAlertData)
        let createActivity = lo.concat(createIn.createManyActivities, createOut.createManyActivities)        
        await activityModel.create(createActivity, {session})
        await alertModel.create(createAlert, {session})
        body.inCount = eventIn?.stones?.length
        body.outCount = eventOut?.stones?.length
        body.inventoryCount = eventInventory?.stones?.length
        return await rawActivityModel.create([body], {session}).then(rawActivity => rawActivity[0])
    }

    async createActivityData(events: IEvent, body: IRawActivity, session: ClientSession): Promise<any> {
        let userId = body.user, createManyActivities = [], createAlertData = [], data: object, rfidData
        // @ts-expect-error
        rfidData = await rfidModel.find({rfid: events.stones, isDeleted: false})
        let skuIds = rfidData.map(rfId => rfId.skuId)
        // @ts-ignore
        await skuModel.updateMany({ _id: skuIds, isDeleted: false }, { 'rfIdStatus': events.EventType, deviceId: body.deviceId, reader : body.reader }, {session})
        let skuData = await skuModel.find({ "_id" : {"$in" : skuIds}, isDeleted: false})
        let priority = (events.EventType === "IN") ? "LOW" : "HIGH"
        let alertId = await alertMasterModel.findOne({ "status": events.EventType, alertType: "USERGENERATED", priority: priority })       
        if (skuData && alertId) {
            for (const sku of skuData) {
                    let activityInsert = await this.createActivityObj(sku, userId, body.companyId,body, events)
                    let alertInsert: IAlert = await this.createAlertObj(events, sku, userId, alertId, body)
                    createManyActivities.push(activityInsert)
                    createAlertData.push(alertInsert)
            }
        }

        data = { createManyActivities, createAlertData }
        return data;
    }

    async createActivityObj(sku_data: ISku, userId: string|null,companyId :string, body: IRawActivity, events: IEvent): Promise<any> {
        // let dmId: any = await diamondMatchModel.findOne({skuId: sku_data._id, $or: [ { status: "MATCHED" }, { status: "NOTMATCHED" } ] }).sort({createdAt: -1}).select('_id').lean()        
        // console.log(dmId);
        
        // let dmId = (!dmId)? null: dmId._id
        return {
            skuId: sku_data?._id, labsId: sku_data?.labsId, userId: userId, companyId: companyId,
            iavId: sku_data.iavId, status: events.EventType, createdBy: userId, updatedBy: userId
        }
    }

    async createAlertObj(events:IEvent , sku_data: ISku, userId: string|null, alertId: IAlertMaster, body: IRawActivity): Promise<any> {
        // let priority = (events.EventType === "IN") ? "LOW" : "HIGH"
        // let alertId = await alertMasterModel.findOne({ "status": events.EventType, alertType: "USERGENERATED", priority: priority })
        return {
            skuId: sku_data._id, userId: userId, alertId: alertId?._id, message: alertId?.description,
            status: alertId?.status, readStatus: "NOTVIEWED", createdBy: body.createdBy, updatedBy: body.updatedBy
        }
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}        
        // @ts-expect-error
        if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        let data = await rawActivityModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            { $lookup: { from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: deviceModel.collection.name, localField: 'deviceId', foreignField: '_id', as: 'deviceId' } },
            { $unwind: { path: "$deviceId", preserveNullAndEmptyArrays: true } },
            {$addFields: {"companyId.sorted": {$toLower: "$companyId.name"}}},
            {
                $group: {
                    _id: null,
                    "companies": {"$addToSet": "$companyId"},
                    "serialNumber": {"$addToSet": "$reader.serial"},
                    "device": {"$addToSet": "$deviceId.name"}
                }
            },
            {
                $project: {
                    _id: 0, "companies._id": 1, "companies.name":1, "companies.sorted":1, "device": 1, "serialNumber": 1          
                }
            }
        ]).then(data => data[0])

        return data
    } 

    async checkDevice(body: any): Promise<any> {
        if (typeof body === 'string') body = await JSON.parse(body)
        let [device] = await Promise.all([
            deviceModel.findOne({token: body.token}).sort({createdAt: -1}),
        ]);
        if (!device?._id) throw new Error("device not registered")
        if (body.user != null &&  body.user.length>0) {
        let [user] = await Promise.all([
            userModel.findOne({'_id': body.user, isDeleted: false}).select('_id')
        ]);
        if (!user?._id) throw new Error("Invalid User")
        }
        return  device
    }

    detailInfoIndex = async ({filters, search, sort:sorter, pageNumber, pageSize, column, _id}: IIndexParam): Promise<IUserNested[]> => {
         //@ts-expect-error
         let cond: ICond = {_id: mongoose.Types.ObjectId(_id as string),'isDeleted': false}, sort, projection: IIndexProjection = {password: 0}
         let secondCond: any = {};         
 
         if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
             sorter = sorter.replace(/'/g, '"')
             const {key, value} = await JSON.parse(sorter)
             sort = {[key] : value}
         }
         else sort = { createdAt: -1, updatedAt: -1};
 
         if(search){
             search = JSON.parse(search)
             const _S = {$regex: search, $options: "i"}
             secondCond['$or'] = [{'transactionId': _S}, {'reader.serial': _S}, {'tagId.rfid': _S}, {'timestamp': _S}, {'companyId.name': _S}]
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
                 else if(k === 'event' && v instanceof Array) secondCond[k] = {$in: v}
                 else if(k === "event") secondCond[k] = v
                 else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
                 else if(k.includes("tagId.") && k[k.length-2] === 'i' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                 else if(k.includes("tagId.") && k[k.length-2] === 'i' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                 else if(k.includes("tagId.") && v instanceof Array) secondCond[k] = {$in: v}
                 else if(k.includes("tagId.")) secondCond[k] = v
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
             {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}},{$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
             {$lookup: {from: addressModel.collection.name, localField: 'addressId', foreignField: '_id', as: 'addressId'}},{$unwind: {path: "$addressId", preserveNullAndEmptyArrays: true}},
             {$lookup: {from: roleModel.collection.name, localField: 'roleId', foreignField: '_id', as: 'roleId'}},{$unwind: {path: "$roleId", preserveNullAndEmptyArrays: true}},
             {$lookup: {from: userModel.collection.name, localField: 'user', foreignField: '_id', as: 'user'}}, {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}},
             {$lookup: {from: deviceModel.collection.name, localField: 'deviceId', foreignField: '_id', as: 'deviceId'}}, {$unwind: {path: "$deviceId", preserveNullAndEmptyArrays: true}},
             {$unwind: {path: "$events", preserveNullAndEmptyArrays: true}},
             {$unwind: {path: "$events.stones", preserveNullAndEmptyArrays: true}},
             {$addFields: {"event": "$events.EventType", "tagId": "$events.stones"}},
             {$match: {"tagId": {$exists: true}}},
             {$lookup: {from: rfidModel.collection.name, localField: 'tagId', foreignField: 'rfid', as: 'tagId'}},{$unwind: {path: "$tagId", preserveNullAndEmptyArrays: true}},
             {$lookup: {from: skuModel.collection.name, localField: 'tagId.skuId', foreignField: '_id', as: 'tagId.skuId'}},{$unwind: {path: "$tagId.skuId", preserveNullAndEmptyArrays: true}},
             { $lookup: { from: labModel.collection.name, localField: 'tagId.skuId.labsId', foreignField: '_id', as: 'tagId.skuId.labsId' } }, { $unwind: { path: "$tagId.skuId.labsId", preserveNullAndEmptyArrays: true } },
             { $lookup: { from: iavModel.collection.name, localField: 'tagId.skuId.iavId', foreignField: '_id', as: 'tagId.skuId.iavId' } }, { $unwind: { path: "$tagId.skuId.iavId", preserveNullAndEmptyArrays: true } },
             { $lookup: { from: rapPriceModel.collection.name, localField: 'tagId.skuId.iavId.rapPriceId', foreignField: '_id', as: 'tagId.skuId.iavId.rapPriceId' } }, { $unwind: { path: "$tagId.skuId.iavId.rapPriceId", preserveNullAndEmptyArrays: true } },
             { $lookup: { from: clientPriceModel.collection.name, localField: 'tagId.skuId.iavId.clientPriceId', foreignField: '_id', as: 'tagId.skuId.iavId.clientPriceId' } }, { $unwind: { path: "$tagId.skuId.iavId.clientPriceId", preserveNullAndEmptyArrays: true } },
 
             // {$project: projection},
         ]
         const sCond = [{$match: secondCond}, {$project: projection}]
         // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
         return await super.aggregateFaceTIndexForDeviceActivityBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    detailFilter = async(userId: IUser['_id'], rawActivityId: IRawActivity["_id"]): Promise<any> => {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {_id:mongoose.Types.ObjectId(rawActivityId as string)}        
        // @ts-expect-error
        if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        let data = await rawActivityModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}},{$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: addressModel.collection.name, localField: 'addressId', foreignField: '_id', as: 'addressId'}},{$unwind: {path: "$addressId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: roleModel.collection.name, localField: 'roleId', foreignField: '_id', as: 'roleId'}},{$unwind: {path: "$roleId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'user', foreignField: '_id', as: 'user'}}, {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: deviceModel.collection.name, localField: 'deviceId', foreignField: '_id', as: 'deviceId'}}, {$unwind: {path: "$deviceId", preserveNullAndEmptyArrays: true}},
            {$unwind: {path: "$events", preserveNullAndEmptyArrays: true}},
            {$unwind: {path: "$events.stones", preserveNullAndEmptyArrays: true}},
            {$addFields: {"event": "$events.EventType", "tagId": "$events.stones"}},
            {$match: {"tagId": {$exists: true}}},
            {$lookup: {from: rfidModel.collection.name, localField: 'tagId', foreignField: 'rfid', as: 'tagId'}},{$unwind: {path: "$tagId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: skuModel.collection.name, localField: 'tagId.skuId', foreignField: '_id', as: 'tagId.skuId'}},{$unwind: {path: "$tagId.skuId", preserveNullAndEmptyArrays: true}},
            { $lookup: { from: labModel.collection.name, localField: 'tagId.skuId.labsId', foreignField: '_id', as: 'tagId.skuId.labsId' } }, { $unwind: { path: "$tagId.skuId.labsId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: iavModel.collection.name, localField: 'tagId.skuId.iavId', foreignField: '_id', as: 'tagId.skuId.iavId' } }, { $unwind: { path: "$tagId.skuId.iavId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: rapPriceModel.collection.name, localField: 'tagId.skuId.iavId.rapPriceId', foreignField: '_id', as: 'tagId.skuId.iavId.rapPriceId' } }, { $unwind: { path: "$tagId.skuId.iavId.rapPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: clientPriceModel.collection.name, localField: 'tagId.skuId.iavId.clientPriceId', foreignField: '_id', as: 'tagId.skuId.iavId.clientPriceId' } }, { $unwind: { path: "$tagId.skuId.iavId.clientPriceId", preserveNullAndEmptyArrays: true } },
           {
                $group: {
                    _id: null,
                    "uniqueWeight": { "$addToSet": "$tagId.skuId.weight" },
                    "color": { "$addToSet": "$tagId.skuId.colorCategory" },
                    // "company": { "$addToSet": "$companyId" },
                    "stoneStatus": { "$addToSet": "$tagId.skuId.stoneStatus" },
                    // "rfIdStatus": { "$addToSet": "$tagId.skuId.rfIdStatus" },
                    "dmStatus": { "$addToSet": "$tagId.skuId.dmStatus" },
                    // "collateralStatus": { "$addToSet": "$tagId.skuId.collateralStatus" },
                    "shape": { "$addToSet": "$tagId.skuId.shape" },
                    "clarity": { "$addToSet": "$tagId.skuId.clarity" },
                    "colorType": { "$addToSet": "$tagId.skuId.colorType" },
                    "labs": { "$addToSet": "$tagId.skuId.labsId" },
                    "eventType": { "$addToSet": "$event" },
                    "uniqueIav": { "$addToSet": "$tagId.skuId.iavId.iav" },
                    "uniquePwv": { "$addToSet": "$tagId.skuId.iavId.pwv" },
                    "uniqueDrv": { "$addToSet": "$tagId.skuId.iavId.drv" },
                    "uniqueRapPrices": { "$addToSet": "$tagId.skuId.iavId.rapPriceId.price" },
                    "uniqueClientPrices": { "$addToSet": "$tagId.skuId.iavId.clientPriceId.price" }
                    // "devices": { "$addToSet": "$deviceId" }
                }
            },
            {
                $project: {
                    _id: 0, "labs.lab": 1, "uniqueWeight": 1, "stoneStatus": 1,
                    "color": 1, "dmStatus": 1, "shape": 1, "clarity": 1, "colorType": 1, "uniqueIav": 1, "uniquePwv": 1,
                    "uniqueDrv": 1, "uniqueRapPrices": 1, "uniqueClientPrices": 1, "eventType":1     
                }
            }
        ]).then(data => data[0])

        return data
    } 
}