import {BaseController} from "../../../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../../helper";
import {guard} from "../../../../helper/Auth";
import { Messages } from "../../../../constants";
import { IClarityMaster } from "./clarity-master.types";
import ClarityMasterBusiness from "./clarity-master.business";
import { ClarityMasterRepository } from "./clarity-master.repository";
import { ClarityMasterValidation } from "./clarity-master.validation";

export class ClarityMasterController extends BaseController<IClarityMaster> {
    constructor() {
        super(new ClarityMasterBusiness(), "clarityMaster", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/clarity-master',guard, this.router);
    }

    init() {
        const validation: ClarityMasterValidation = new ClarityMasterValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/" , validation.createClarityMaster, TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/" , TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", guard, TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        res.locals = await new ClarityMasterRepository().create(body, loggedInUserId)
        if(res.locals.message === "Create Successful") await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
        else await JsonResponse.jsonError(req, res, `{this.url}.create`);
    }
}