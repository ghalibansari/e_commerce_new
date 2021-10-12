import { IIndexParam, IIndexProjection } from "../../interfaces/IRepository";
import {Enum} from "../../constants/Enum";
import {BaseRepository} from "../BaseRepository";
import ledSelectionModel from "./led-selection.model";
import { ILedSelection } from "./ledSelection.types";
import mongoose, {ClientSession} from "mongoose";
import { Messages } from "../../constants";
import rfidModel from "../rfid/rfid.model";
import { data } from "cypress/types/jquery";
import skuModel from "../sku/sku.model";
import diamondMatchModel from "../diamond-match/diamond-match.model";
import { IActivity } from "../activity/activity.types";
import { IUser } from "../user/user.types";
import activityModel from "../activity/activity.model";
import { ISku } from "../sku/sku.types";


export class LedSelectionRepository extends BaseRepository<ILedSelection> {
    constructor () {
        super(ledSelectionModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<any> => {    //Todo need more optimization... worst response time...
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false, $or: [{lifeTime: {$gte : new Date()}}, {lifeTime: null}]}, sort = {}, projection: IIndexProjection = {password: 0}
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

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'companyId.name': _S}]
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
            // {$lookup: {from: 'rfids', localField: 'tagNos', foreignField: 'rfid', as: 'tagNos'}}, {$unwind: {path: "$tagNos", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'skus', localField: 'skuIds', foreignField: '_id', as: 'skuIds'}}, {$unwind: {path: "$skuIds", preserveNullAndEmptyArrays: true}},
            // {$lookup: {from: 'rfids', localField: 'tagNos.skuId.rfId', foreignField: '_id', as: 'tagNos.skuId.rfId'}}, {$unwind: {path: "$tagNos.skuId.rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}}, {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
            {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond}, {$project: projection},
            { "$group": {
                "_id": "$_id",
                "companyId": { "$first": "$companyId" },
                "lifeTime": { "$first": "$lifeTime" },
                "tagCount": {"$first": "$tagCount"},
                "createdAt": {"$first": "$createdAt"},
                "updatedAt": {"$first": "$updatedAt"},
                "comments": {"$first": "$comments"},
                "isActive": {"$first": "$isActive"},
                "isDeleted": {"$first": "$isDeleted"},
                "skuIds": { "$push": "$skuIds" },
                "createdBy": { "$first": "$createdBy" },
                "updatedBy": { "$first": "$updatedBy" }
              }},
            {$unset: ["createdBy.password", "updatedBy.password"]}
        ]
        // const [{data, page}] = await Promise.all([
        //     await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize),
        // ])
        const sCond = [{$match: secondCond}, {$project: projection},]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)

        // header.totalStone = page.filterCount
        // countHeader.forEach(({status}: any) => {if(status === 'NOTMATCHED') header.notMatched = header.notMatched + 1; else if(status === 'MATCHED') header.matched = header.matched + 1})
        // return { page, data}
    }

    async deleteMany(ledSelectionIds: any, session: ClientSession): Promise<any> {
        let deletedData = await ledSelectionModel.updateMany({ "_id": ledSelectionIds }, { isDeleted: true, isActive: false }, {new: true}) //need to add session
        if(deletedData) return {status: true, message: Messages.DELETE_SUCCESSFUL}
    }

    update = async(body: any, user: any, session: ClientSession) : Promise<ILedSelection|null> => {
        // let ledSelectionData = await ledSelectionModel.findOne({_id: body._id, isDeleted: false});
        // let data = await ledSelectionModel.aggregate([
        //     {$match: {_id: mongoose.Types.ObjectId(body._id as string)}},
        //     {$lookup: {from: 'skus', localField: 'skuIds', foreignField: '_id', as: 'skuIds'}}, {$unwind: {path: "$skuIds", preserveNullAndEmptyArrays: true}},
        //     { "$group": {_id: null, "clientIds": {$addToSet: "$skuIds.clientRefId"}}}
        // ]).then(data => data[0])
        let activityData: IActivity[] = [], skuData: any = [];
        body.skuIds = [];
        // let uniqueClientIds = body.clientRefId.filter((element: any) => !data.clientIds.includes(element));        
        // if(uniqueClientIds.length > 0) {
        skuData = await skuModel.find({ clientRefId: { $in: body.clientRefId }, companyId: body.companyId, isDeleted: false }).session(session);
        if (skuData.length !== body.clientRefId?.length) throw new Error("Invalid Sku No")
        // }                
        for (const sku of skuData) {
            body.skuIds.push(sku?._id)
            let dmId: any = await diamondMatchModel.findOne({ skuId: sku._id, $or: [{ status: "MATCHED" }, { status: "NOTMATCHED" }] }).sort({ createdAt: -1 }).select('_id').lean();
            if (!dmId) dmId = null;
            let activity = {
                companyId: sku.companyId, skuId: sku._id, labsId: sku.labsId, iavId: sku.iavId,
                userId: user.createdBy, dmId, status: "LED TRIGGER", ...user
            };
            if (body.comments) activity = { ...activity, comments: body.comments };
            activityData.push(activity);
        }
        if(body.clientRefId) body.tagCount = body.skuIds.length;
        await activityModel.create(activityData);//need to ad session
        return ledSelectionModel.findOneAndUpdate({_id: body._id}, {updatedBy: user.createdBy, ...body}, {new: true});// need to add session

    }

    // ledSelection = async(companyId: any): Promise<any> => {
    //     let ledSelection = await ledSelectionModel.aggregate([
    //         {$match: {companyId: mongoose.Types.ObjectId(companyId as string), lifeTime: { $gte: new Date() }}},
    //         {$unwind: {path: "$skuIds", preserveNullAndEmptyArrays: true}},
    //         // {$lookup: { from: 'rfids', localField: 'tagNos', foreignField: 'rfid', as: 'tagNos' } },{$unwind: {path: "$tagNos", preserveNullAndEmptyArrays: true}},
    //         {$lookup: { from: 'skus', localField: 'skuIds', foreignField: '_id', as: 'skuId' } },{$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
    //         {$lookup: { from: 'rfids', localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId' } },{$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true}},

    //     ]);        

    //     let array: any = [], triggerData: any = [];
    //     for (const item of ledSelection) {
    //         if (array.includes(String(item.skuId._id))) continue;
    //         array.push(String(item.skuId._id));
    //         let data: any = {};
    //         data.serialNumber = item.skuId.reader?.serial;
    //         data.tag = item.skuId.rfId?.rfid;
    //         data.clientRefId = item.skuId.clientRefId
    //         data.comments = item.comments;
    //         data.drawer = item.skuId.reader?.drawer;
    //         triggerData.push(data)
    //     }

    //     return triggerData
    // }

    ledSelection = async(companyId: any): Promise<any> => {
        let projection1 = {"companyId": 1, "lifeTime" : 1, "skuIds.tagNo":1, "skuIds.serial":1, "skuIds.drawer":1, "updatedBy":1,
           "tagCount":1, "_id":1, "createdAt" :1, "updatedAt": 1, "comments": 1, "isActive":1, "isDeleted": 1, "createdBy":1}
    
        return  ledSelectionModel.aggregate([
            {$match: {companyId: mongoose.Types.ObjectId(companyId as string)}},
            {$match: {'isDeleted': false}},
            {$match: {lifeTime: {$gte: new Date()}}},
            {$lookup: {from: 'skus', localField: 'skuIds', foreignField: '_id', as: 'skuIds'}}, {$unwind: {path: "$skuIds", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'rfids', localField: 'skuIds.rfId', foreignField: '_id', as: 'skuIds.rfId'}}, {$unwind: {path: "$skuIds.rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
            {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            { $addFields: {"skuIds.tagNo": "$skuIds.rfId.rfid"}},
            { $addFields: {"skuIds.serial": "$skuIds.reader.serial"}},
            { $addFields: {"skuIds.drawer": "$skuIds.reader.drawer"}},
            { $addFields: {"createdBy": "$createdBy.firstName"}},
            { $addFields: {"updatedBy": "$updatedBy.firstName"}},
            {$project: {...projection1}},
            { "$group": {
                "_id": "$_id",
                "lifeTime": { "$first": "$lifeTime" },
                "tagCount": {"$first": "$tagCount"},
                "createdAt": {"$first": "$createdAt"},
                "updatedAt": {"$first": "$updatedAt"},
                "comments": {"$first": "$comments"},
                "skuIds": { "$push": "$skuIds" },
                "createdBy": { "$first": "$createdBy" },
                "updatedBy": { "$first": "$updatedBy" }
              }},

        ])   
    }
}