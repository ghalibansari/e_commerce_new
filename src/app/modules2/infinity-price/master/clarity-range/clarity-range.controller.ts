import {BaseController} from "../../../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../../helper";
import {guard} from "../../../../helper/Auth";
import { Messages } from "../../../../constants";
import { IClarityRange } from "./clarity-range.types";
import ClarityRangeBusiness from "./clarity-range.business";
import { ClarityRangeRepository } from "./clarity-range.repository";
import clarityRangeModel from "./clarity-range.model";
import { ClarityRangeValidation } from "./clarity-range.validation";

export class ClarityRangeController extends BaseController<IClarityRange> {
    constructor() {
        super(new ClarityRangeBusiness(), "clarityRange", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/clarity-Range',guard, this.router);
    }

    init() {
        const validation: ClarityRangeValidation = new ClarityRangeValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/" , validation.createClarityRange, TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/" , TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", guard, TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new ClarityRangeRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        res.locals = await new ClarityRangeRepository().create(body, loggedInUserId)
        if(res.locals.message === "Create Successful") await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
        else await JsonResponse.jsonError(req, res, `{this.url}.create`);
    }
}