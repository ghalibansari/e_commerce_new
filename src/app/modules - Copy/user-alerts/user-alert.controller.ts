import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {Messages, Texts} from "../../constants";
import { IUserAlerts } from "./user-alert.types";
import UserAlertBusiness from "./user-alert.business";
import { UserAlertRepository } from "./user-alert.repository";

export class UserAlertController extends BaseController<IUserAlerts> {
    constructor() {
        super(new UserAlertBusiness(), "userAlert", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/user-alert',guard, this.router);
    }

    init() {
        // const validation: AlertMasterValidation = new AlertMasterValidation();
        // this.router.get("/",  TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        // this.router.post("/" ,  TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/", validation.updateAlertMaster ,  TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));   // delete is not required in this module
        // this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        // this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
        this.router.get("/count", TryCatch.tryCatchGlobe(this.count));

    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const { body: {newData, loggedInUser:{_id:loggedInUserId}}} = req as any;
        const {data, page}: any = await new UserAlertRepository().index(req.query as any, loggedInUserId )
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    count = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const { body: {newData, loggedInUser:{_id:loggedInUserId}}} = req as any;
        const data: any = await new UserAlertRepository().count( loggedInUserId )
        res.locals = {status: true,  data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)

    }

    // create = async(req: Request, res: Response): Promise<void> => {
    //     res.locals = {status: false, message: Messages.CREATE_FAILED}
    //     const {data, page}: any = await new AlertConfigurationRepository().create(req.query as any)
    //     res.locals = {status: true, page, data, message: Messages.CREATE_SUCCESSFUL}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    // }
}