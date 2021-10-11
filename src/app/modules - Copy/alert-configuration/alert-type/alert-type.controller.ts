import {BaseController} from "../../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../helper";
import {guard} from "../../../helper/Auth";
// import {AlertMasterValidation} from "./alert-master.validation"
import { IAlertType } from "./alert-type.types";
import AlertTypeBusiness from "./alert-type.business";
import { AlertTypeValidation } from "./alert-type.validation";
import { Messages } from "../../../constants";
import { AlertTypeRepository } from "./alert-type.repository";

export class AlertTypeController extends BaseController<IAlertType> {
    constructor() {
        super(new AlertTypeBusiness(), "alertType", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/alert-type',guard, this.router);
    }

    init() {
        const validation: AlertTypeValidation = new AlertTypeValidation();
        this.router.get("/",  TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.createAlertType,  TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/",  TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", guard, TryCatch.tryCatchGlobe(this.deleteBC));   // delete is not required in this module
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const {data, page}: any = await new AlertTypeRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }
}