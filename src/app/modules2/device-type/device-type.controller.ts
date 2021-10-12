import {BaseController} from "../BaseController"
import {Application, Request, Response} from "express"
import {JsonResponse, TryCatch} from "../../helper"
import {guard} from "../../helper/Auth"
import DeviceTypeBusiness from "./device-type.business"
import { IDeviceType } from "./device-type.types"
import { DeviceTypeValidation } from "./device-type.validation"
import { Messages } from "../../constants"
import { DeviceTypeRepository } from "./device-type.repository"

export class DeviceTypeController extends BaseController<IDeviceType> {
    constructor() {
        super(new DeviceTypeBusiness(), "device-type", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/device-type', guard, this.router);
    }

    init() {
        const validation: DeviceTypeValidation = new DeviceTypeValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.createDeviceType, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateDeviceType, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.delete));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const {data, page}: any = await new DeviceTypeRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    delete = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.DELETE_FAILED}
        let { query: {_id: deviceTypeId}, body:{ loggedInUser:{_id:loggedInUserId}}} = req
        const data = await new DeviceTypeRepository().delete(deviceTypeId as any, loggedInUserId)
        res.locals = {status: true, message: Messages.DELETE_SUCCESSFUL, data: 1}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        let {body: {loggedInUser: {_id: loggedInUserId}}} = req
        let data = await new DeviceTypeRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}