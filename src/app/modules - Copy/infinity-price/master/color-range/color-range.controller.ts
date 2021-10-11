import {BaseController} from "../../../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../../helper";
import {guard} from "../../../../helper/Auth";
import { Messages } from "../../../../constants";
import { IColorRange } from "./color-range.types";
import ColorRangeBusiness from "./color-range.business";
import { ColorRangeRepository } from "./color-range.repository";

export class ColorRangeController extends BaseController<IColorRange> {
    constructor() {
        super(new ColorRangeBusiness(), "colorRange", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/color-Range',guard, this.router);
    }

    init() {
        // const validation: ClarityRangeValidation = new ClarityRangeValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/" ,  TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/" , TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", guard, TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new ColorRangeRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        res.locals = await new ColorRangeRepository().create(body, loggedInUserId)
        if(res.locals.message === "Create Successful") await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
        else await JsonResponse.jsonError(req, res, `{this.url}.create`);
    }
}