import {BaseController} from "../BaseController"
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {Messages, Texts} from "../../constants";
import CompanyBusiness from "../company/company.business";
import DeviceTypeBusiness from "../device-type/device-type.business";
import { MongooseTransaction } from "../../helper/MongooseTransactions";
import { RequestWithTransaction } from "../../interfaces/Request";
import * as Excel  from 'exceljs'
import path from 'path'
import { SkuRepository } from "../sku/sku.repository";
import { DeviceRepository } from "../device/device.repository";
import { DiamondMatchRepository } from "../diamond-match/diamond-match.repository";
import { AlertRepository } from "../alert/alert.repository";
import skuModel from "../sku/sku.model";
import diamondRegistrationModel from "../diamond-registration/diamond-registration.model";
import rfidModel from "../rfid/rfid.model";
import diamondMatchModel from "../diamond-match/diamond-match.model";
import activityModel from "../activity/activity.model";
import deviceModel from "../device/device.model";
import userModel from "../user/user.model";
import deviceCommandModel from "../device-command/device-command.model";
import { IUser } from "../user/user.types";
import {devices} from "../../socket"
import { ErrorCodes } from "../../constants/ErrorCodes";
import alertMasterModel from "../alert-master/alert-master.model";
import { IActivity } from "../activity/activity.types";
import alertModel from "../alert/alert.model";
import { alertStatusEnum } from "../alert/alert.types";
import { IDevice } from "../device/device.types";
import mongoose, {ClientSession} from "mongoose";
import { Enum } from "../../constants/Enum";
import { skuDmStatusEnum } from "../sku/sku.types";
import ledSelectionModel from "../led-selection/led-selection.model";
import companyModel from "../company/company.model";
import { ILedSelection } from "../led-selection/ledSelection.types";


export class DeviceIntegrationController extends BaseController<any> {
    constructor() {
        super('', "device-integration", true, '')
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/device-integration', guard, this.router);
    }

    init() {
        const transaction: MongooseTransaction = new MongooseTransaction();
        // this.router.get("/sku/get-by-tag", TryCatch.tryCatchGlobe(this.getSkuByTag));
        // this.router.post("/device/register-device", TryCatch.tryCatchGlobe(this.registerDevice))
        // this.router.put("/diamond-match",TryCatch.tryCatchGlobe(this.update))
        // this.router.get("/sku/index", TryCatch.tryCatchGlobe(this.index))
        // this.router.get("/alert", TryCatch.tryCatchGlobe(this.alertindex))
        this.router.post("/diamond-match-registration", transaction.startTransaction, TryCatch.tryCatchGlobe(this.diamondMatchRegistration))
        this.router.post("/diamond-match", transaction.startTransaction, TryCatch.tryCatchGlobe(this.diamondMatchWithActivity) )
        this.router.post("/device-command", TryCatch.tryCatchGlobe(this.createDeviceCommand))
        this.router.post('/triggered-led', transaction.startTransaction, TryCatch.tryCatchGlobe(this.triggeredLed))
        this.router.get('/led-selection', TryCatch.tryCatchGlobe(this.triggerLed))
        this.router.get('/sku', TryCatch.tryCatchGlobe(this.getList))
    }

    getSkuByTag = async (req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let data = await new SkuRepository().getByTag(req.query.tagNo);
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.getSkuByTag`);
    }

    registerDevice = async (req: Request, res: Response): Promise<void> => {
        let {body, body:{ loggedInUser:{_id:loggedInUserId}}, mongoSession}  = req as RequestWithTransaction;
        body.createdBy = body.updatedBy = loggedInUserId        
        let data = await new DeviceRepository().registerDevice(body, mongoSession)
        res.locals = data
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async update(req: Request, res: Response): Promise<void> {
        let {body, mongoSession, body:{skuId,comments, loggedInUser:{_id:loggedInUserId}}} = req as RequestWithTransaction
        body.performedBy = body.updatedBy =  loggedInUserId
        let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
        let data = await new DiamondMatchRepository().update(body, user, mongoSession)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`)
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page, header}: any = await new SkuRepository().index(req.query);
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async alertindex(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        if(req?.body?.loggedInUser?.roleName !== Texts.SPACECODEADMIN){
            //@ts-expect-error
            let filters: {}[] = JSON.parse(req.query.filters);
            filters.forEach((data:any, i) => {if (data.key === Texts.companyId) data.key = Texts.skuId_companyId})
            req.query.filters = JSON.stringify(filters);
        }
        const {data, page}: any = await new AlertRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    diamondMatchRegistration = async (req: Request, res: Response): Promise<void> => { // need to add session for this
        res.locals = { status: false, message: Messages.UPDATE_FAILED }
        let { body, mongoSession, body: { _id, loggedInUser: { _id: loggedInUserId } } } = req as RequestWithTransaction
        let device = await this.checkDmDevice(body, loggedInUserId);
        let data;
        let rfid = await rfidModel.findOne({ rfid: String(body.tagNo), isDeleted: false }).sort({ createdAt: -1 })
        let sku = await skuModel.findOne({ _id: rfid?.skuId, isDeleted: false })
        let update = { "dmGuid": body.dmGuId, "dmStatus": skuDmStatusEnum.COMPLETED, updatedBy: loggedInUserId }
        if (!rfid) throw new Error("tagNo not registered")
        if(body.status === "success") {
            [data] = (body.actionType === "REGISTRATION") ? await Promise.all([
                diamondRegistrationModel.create([{ skuId: rfid?.skuId, status: body.status, companyId: sku?.companyId, dmGuid: body.dmGuId, action: "REGISTRATION", createdBy: loggedInUserId, updatedBy: loggedInUserId }], {session: mongoSession}).then(data => data[0]),
                skuModel.findOneAndUpdate({ _id: rfid?.skuId }, update, { new: true, session: mongoSession })
            ]) : await Promise.all([
                diamondRegistrationModel.create([{ skuId: rfid?.skuId, status: body.status, companyId: sku?.companyId, dmGuid: body.dmGuId, action: "ALTER_REGISTRATION", createdBy: loggedInUserId, updatedBy: loggedInUserId }], {session: mongoSession}).then(data => data[0]),
            ]);
            let alertType = await alertMasterModel.findOne({ status: 'DIAMOND MATCH REGISTRATION', alertType: "USERGENERATED" }, { createdAt: -1 })// to do alertType as Usergenerated
            let activityData = {
                companyId: sku?.companyId, skuId: sku?._id, labsId: sku?.labsId, iavId: sku?.iavId,
                userId: loggedInUserId, status: alertStatusEnum.DIAMOND_MATCH_REGISTRATION, createdBy: loggedInUserId, updatedBy: loggedInUserId, comments: body.comments
            };
            const alertData = {userId: loggedInUserId, message: "working good", skuId: sku?._id, alertId: alertType?._id, status: alertStatusEnum.DIAMOND_MATCH_REGISTRATION, createdBy: loggedInUserId, updatedBy: loggedInUserId}
            let [ activity , alert] = await Promise.all([
                activityModel.create([activityData], { session: mongoSession }).then(activity => activity[0]),
                alertModel.create([alertData], { session: mongoSession }).then(alert => alert[0])
            ])    
        } else {
            let errorLog = {code: body.error.code, description: body.error.description, createdBy: loggedInUserId, createdAt: new Date()};
            data = await diamondRegistrationModel.create([{ skuId: rfid?.skuId,  companyId: sku?.companyId,dmGuid: body.dmGuId, status: body.status, action: body.actionType, error:errorLog,createdBy: loggedInUserId, updatedBy: loggedInUserId }], {mongoSession});
        }
        res.locals = { status: true, message: Messages.UPDATE_SUCCESSFUL, data: {event_id: body.event_id} }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.diamondMatchRegistration`)
    }

    diamondMatchWithActivity = async (req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let {body, mongoSession, body:{ loggedInUser:{_id:loggedInUserId, companyId}}} = req as RequestWithTransaction;
        await this.checkDmDevice(body, loggedInUserId);
        let dmId: any = {};
        let rfid = await rfidModel.findOne({ rfid: String(body.tagNo), isDeleted: false }).sort({ createdAt: -1 });
        let sku = await skuModel.findOne({ _id:rfid?.skuId});
        if (!sku?._id) throw new Error("TagNo is Not assigned to Stones ");
        // let dmId: any = await diamondMatchModel.findOne({ skuId: sku._id, $or: [{ status: "MATCHED" }, { status: "NOTMATCHED" }] }).sort({ createdAt: -1 }).select('_id').lean()
        let DmExists=await diamondMatchModel.findOne({skuId : sku?._id, status: "NOTMATCHED"});
        if(!DmExists) DmExists = await diamondMatchModel.create([{skuId : sku?._id, companyId: sku.companyId, createdBy: loggedInUserId, updatedBy:loggedInUserId}], {mongoSession}).then(data => data[0]);        
        if(body.status === "success"){
            //@ts-expect-error
            dmId = await diamondMatchModel.updateMany({skuId : sku?._id, status: "NOTMATCHED"}, {status: "MATCHED", updatedBy: loggedInUserId, actionType:body.actionType, foundDmGuid:body.foundDmGuid}, {new: true, mongoSession});
            if(dmId.nModified === 0) throw new Error("Diamond Match Failed");
            let activityData = {
                companyId: sku.companyId, skuId: sku._id, labsId: sku.labsId, iavId: sku.iavId,
                userId: loggedInUserId, dmId: DmExists._id, status: "MATCHED", createdBy: loggedInUserId, updatedBy: loggedInUserId, comments: body.comments
            };
            await activityModel.create([activityData], {session: mongoSession}).then(activity => activity[0]); 
            let registerDevice = await deviceModel.find({companyId, isDeleted: false});
            for (const device of registerDevice) {
                let token = device?.token;
                if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_DIAMOND_MATCH, message: "DiamondMatche with activity", data: null});    
            }    
        }
        if(body.status === "failure") {
            let errorLog = {code: body.error.code, description: body.error.description, createdBy: loggedInUserId, createdAt: new Date()};
            //@ts-expect-error
            dmId = await diamondMatchModel.findOneAndUpdate({skuId : sku?._id, status: "NOTMATCHED"}, {$push: {error: errorLog},actionType:body.actionType,foundDmGuid:body.foundDmGuid}, {new: true, mongoSession}).sort({createdAt:-1});
            if(!dmId)throw new Error("Diamond Match Failed");
        }
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data: {event_id: body.event_id}};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.diamondMatch`);
    }

    checkDmDevice = async (body: any, userId: IUser['_id']): Promise<any> => {
        if (typeof body === 'string') body = await JSON.parse(body);
        let [device, user] = await Promise.all([
            deviceModel.findOne({ token: body.token, isDeleted: false }).sort({ createdAt: -1 }),
            userModel.findOne({ '_id': userId, isDeleted: false }).select('_id')
        ]);
        if (!device?._id) throw new Error("device not registered")
        if(!device?.userIds.includes(userId)) throw new Error("user doesn't have access")
        return device
    }

    createDeviceCommand = async (req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.CREATE_FAILED};
        let {body,  body:{_id, loggedInUser:{_id:loggedInUserId, companyId}}} = req;
        let device = await deviceModel.findOne({ token: body.token , isDeleted: false }).sort({ createdAt: -1 });
        if (!device) throw new Error("device not registered");
        if (!device?.userIds.includes(loggedInUserId)) throw new Error("user doesn't have access");
        body.companyId = companyId
        body.deviceId = device._id
        body.createdBy = body.updatedBy = loggedInUserId
        let data = await deviceCommandModel.create(body)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data: {event_id: body.event_id}}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.createDeviceCommand`);
    }

    triggeredLed = async (req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let {body, mongoSession, body:{ loggedInUser:{_id:loggedInUserId, companyId}}} = req as RequestWithTransaction;
        body.event = "triggeredLed"
        if (typeof body === 'string') body = await JSON.parse(body);
        let [device, user] = await Promise.all([
            deviceModel.findOne({ token: body.token, isDeleted: false }).sort({ createdAt: -1 }),
        ]);
        if (!device?._id) throw new Error("device not registered")
        let tags = body.info.map((value: any) => { if (value.status === true) return String(value.tagNumber) }).filter(Boolean);
        let skuData = await rfidModel.find({ rfid: { $in: tags }, isDeleted: false }).sort({ createdAt: -1 }).populate([{ path: "skuId" }]).select({ "skuId._id": 1, "_id": 0 })
        let data = await rfidModel.aggregate([
            { $match: { rfid: { $in: tags } } },
            { $lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
            { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
            { $group: { _id: null, "skuIds": { "$addToSet": "$skuId._id" } } },
            { $project: { _id: 0, skuIds: 1 } }
        ]).then(data => data[0])

        let deviceDetails = await deviceModel.find({companyId, isDeleted: false});
        for (const device of deviceDetails) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_LED_SELECTION, message: "triggered Led", data: {tagNos : tags}});
        }
        //@ts-expect-error
        let activityData = await activityModel.updateMany({ status: "LED TRIGGER", skuId: { $in: data.skuIds } }, { status: "LED TRIGGERED", updatedBy: loggedInUserId }, { new: true, mongoSession })
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data: {inventory_id: body.inventory_id}}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.triggeredLed`);
    } 

    triggerLed = async (req: Request, res: Response): Promise<void> => {
        let { query, body: { loggedInUser: { _id: loggedInUserId, companyId } } } = req;
        let activity : any = [], ledSelection: ILedSelection[]|ILedSelection|{}, serialNumber: any = []
 
        if (query.serialNumber) {
            //@ts-expect-error
            let device = await deviceModel.findOne({ serialNumber: query.serialNumber, isDeleted: false }, 'serialNumber').sort({ createdAt: -1 })

            ledSelection = (device?.serialNumber)? await ledSelectionModel.aggregate([
                    {$match: {'isDeleted': false, $or: [{lifeTime: {$gte : new Date()}}, {lifeTime: null}]}},
                    {$lookup: {from: skuModel.collection.name, localField: 'skuIds', foreignField: '_id', as: 'skuIds'}}, {$unwind: {path: "$skuIds", preserveNullAndEmptyArrays: true}},
                    {$lookup: {from: rfidModel.collection.name, localField: 'skuIds.rfId', foreignField: '_id', as: 'skuIds.rfId'}}, {$unwind: {path: "$skuIds.rfId", preserveNullAndEmptyArrays: true}},
                    {$addFields: {"skuIds.tagNo": "$skuIds.rfId.rfid"}},
                    {$addFields: {"skuIds.serialNumber": "$skuIds.reader.serial"}},
                    {$addFields: {"skuIds.drawer": "$skuIds.reader.drawer"}},
                    {$match: { "skuIds.serialNumber": device.serialNumber } },
                    {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}}, {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
                    {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
                    {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},{$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
                    { "$group": {
                        "_id": "$_id",
                        "companyId": { "$first": "$companyId.name" },
                        "lifeTime": { "$first": "$lifeTime" },
                        "tagCount": {"$first": "$tagCount"},
                        "createdAt": {"$first": "$createdAt"},
                        "updatedAt": {"$first": "$updatedAt"},
                        "comments": {"$first": "$comments"},
                        "isActive": {"$first": "$isActive"},
                        "isDeleted": {"$first": "$isDeleted"},
                        "skuIds": { "$push": "$skuIds" },
                        "createdBy": { "$first": "$createdBy.firstName" },
                        "updatedBy": { "$first": "$updatedBy.firstName" }
                    }},
                    {  $project: {
                        "_id": 1, "companyId": 1, "lifeTime": 1, "tagCount": 1, "createdAt": 1, "updatedAt":1,
                        "comments": 1, "createdBy": 1, "updatedBy": 1, "skuIds.tagNo":1, "skuIds.serialNumber":1, "skuIds.drawer":1
                    }}
            ]) : {}
        }
        else {            
            let device = await deviceModel.aggregate([
                { $match: { isDeleted:false, companyId: mongoose.Types.ObjectId(companyId as string) } },
                // { $group: { _id: null, "serialNumber": { "$addToSet": "$serialNumber" } } }
            ])
            device.forEach((element: IDevice) =>  serialNumber.push(element.serialNumber));          
            console.log(serialNumber);
            
            ledSelection = (serialNumber)? await ledSelectionModel.aggregate([
                {$match: {'isDeleted': false, $or: [{lifeTime: {$gte : new Date()}}, {lifeTime: null}]}},
                {$lookup: {from: skuModel.collection.name, localField: 'skuIds', foreignField: '_id', as: 'skuIds'}}, {$unwind: {path: "$skuIds", preserveNullAndEmptyArrays: true}},
                {$lookup: {from: rfidModel.collection.name, localField: 'skuIds.rfId', foreignField: '_id', as: 'skuIds.rfId'}}, {$unwind: {path: "$skuIds.rfId", preserveNullAndEmptyArrays: true}},
                {$addFields: {"skuIds.tagNo": "$skuIds.rfId.rfid"}},
                {$addFields: {"skuIds.serialNumber": "$skuIds.reader.serial"}},
                {$addFields: {"skuIds.drawer": "$skuIds.reader.drawer"}},
                {$match: { "skuIds.serialNumber": { $in: serialNumber } } },
                {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}}, {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
                {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
                {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},{$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
                { "$group": {
                    "_id": "$_id",
                    "companyId": { "$first": "$companyId.name" },
                    "lifeTime": { "$first": "$lifeTime" },
                    "tagCount": {"$first": "$tagCount"},
                    "createdAt": {"$first": "$createdAt"},
                    "updatedAt": {"$first": "$updatedAt"},
                    "comments": {"$first": "$comments"},
                    "isActive": {"$first": "$isActive"},
                    "isDeleted": {"$first": "$isDeleted"},
                    "skuIds": { "$push": "$skuIds" },
                    "createdBy": { "$first": "$createdBy.firstName" },
                    "updatedBy": { "$first": "$updatedBy.firstName" }
                }},
                {  $project: {
                    "_id": 1, "companyId": 1, "lifeTime": 1, "tagCount": 1, "createdAt": 1, "updatedAt":1,
                    "comments": 1, "createdBy": 1, "updatedBy": 1, "skuIds.tagNo":1, "skuIds.serialNumber":1, "skuIds.drawer":1
                }}
            ]) : {}
        }

        res.locals = { status: true, message: Messages.FETCH_SUCCESSFUL, data: ledSelection }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.triggerLed`);
    }

    getList = async (req: Request, res: Response): Promise<void> => {
        let { body: { loggedInUser: { _id: loggedInUserId, companyId } } } = req;
        let data = await skuModel.aggregate([
            {$match: {companyId: mongoose.Types.ObjectId(companyId as string), isDeleted: false, collateralStatus: Enum.collateralStatus.COLLATERAL_IN, rfIdStatus: Enum.rfidStatus.IN}},
            {$lookup: {from: 'rfids', localField: 'rfId', foreignField: '_id', as: 'rfId'}}, {$unwind: {path: "$rfId", preserveNullAndEmptyArrays: true}},
            {$addFields: {"tagNo": "$rfId.rfid"}},
            {$project: {"tagNo": 1, "clientRefId": 1, "stoneStatus": 1, "rfIdStatus": 1}}
        ])
        res.locals = { status: true, message: Messages.FETCH_SUCCESSFUL, data }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.getList`);
    }
         
}
