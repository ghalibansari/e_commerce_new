import SettingBusiness from "./setting.business";
import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {Messages} from "../../constants"
import {SettingValidation} from "./setting.validation"
import {guard} from "../../helper/Auth";
import {ISetting} from "./setting.types";
import {BaseHelper} from "../BaseHelper";
import {SettingRepository} from "./setting.repository";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {RequestWithTransaction} from "../../interfaces/Request";
import * as Excel from 'exceljs'
import path from 'path'
import deviceModel from "../device/device.model";
import {devices} from "../../socket"
import { ErrorCodes } from "../../constants/ErrorCodes";

/*import faker from "faker";*/


export class SettingController extends BaseController<ISetting> {
    constructor() {
        super(new SettingBusiness(), "setting", true, new SettingRepository());
        this.init();
    }

    register(express: Application) { express.use('/api/v1/setting', guard, this.router) }


    init() {
        // const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: SettingValidation = new SettingValidation();
        // this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        // this.router.post("/", validation.createUser, transaction.startTransaction, TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/", validation.updateUser, transaction.startTransaction, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.put("/", validation.updateSetting, TryCatch.tryCatchGlobe(this.update));
        // this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        // this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        // this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    // async find(req: Request, res: Response){
    //     let populate = [{path: 'addressId'}, {path: 'companyId'}, {path: 'roleId'}];
    //     await new SettingsController().findBC(req, res, populate)
    // }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        console.log("=============working");
        
        const {data, page}: any = await new SettingRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    // async findById(req: Request, res: Response): Promise<void> {
    //     res.locals = {status: false, message: Messages.CREATE_FAILED}
    //     // @ts-expect-error
    //     const data = await new SettingsRepository().findById(req.query._id)
    //     res.locals = {status: false, message: Messages.CREATE_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `findById`);
    // }

    // async create(req: Request, res: Response){
    //     res.locals = {status: false, message: Messages.CREATE_FAILED}
    //     let {body, mongoSession, body:{loggedInUser:{_id:loggedInUserId, companyId}}} = req as RequestWithTransaction
    //     body.createdBy = body.updatedBy = body.address.createdBy = body.address.updatedBy = loggedInUserId
    //     const data = await new SettingsRepository().create(body, mongoSession)
    //     let registerDevice = await deviceModel.find({companyId, isDeleted: false});
    //     console.log(registerDevice, "========= checking");
    //     console.log(companyId, "=====checkingCompany");
    //
    //
    //     for (const device of registerDevice) {
    //         let token = device?.token;
    //         console.log(devices[token], "======= checking token");
    //
    //         if(token!=null && devices && devices[token]) devices[token].emit("refresh", ErrorCodes.REFRESH_USER);
    //     }
    //     res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `create`);
    // }

    async update(req: Request, res: Response){
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req as RequestWithTransaction
        body.updatedBy = loggedInUserId
        const data = await new SettingRepository().update(body)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `update`);
    }
}