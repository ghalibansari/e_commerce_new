import {BaseController} from "../../../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../../helper";
import {guard} from "../../../../helper/Auth";
import { Messages } from "../../../../constants";
import { IFluorescenseMaster } from "./fluorescense-master.types";
import FluorescenseMasterBusiness from "./fluorescense-master.business";
import { FluorescenseMasterValidation } from "./fluorescense-master.validation";
import { FluorescenseMasterRepository } from "./fluorescense-master.repository";

export class FluorescenseMasterController extends BaseController<IFluorescenseMaster> {
    constructor() {
        super(new FluorescenseMasterBusiness(), "fluorescenseMaster", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/fluorescense-master',guard, this.router);
    }

    init() {
        const validation: FluorescenseMasterValidation = new FluorescenseMasterValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/" , validation.createFluorescenseMaster, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/" , validation.updateFluorescenseMaster, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    create = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        const data = await new FluorescenseMasterRepository().create(body)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    update = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.updatedBy = loggedInUserId
        const data = await new FluorescenseMasterRepository().update(body)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }
}
