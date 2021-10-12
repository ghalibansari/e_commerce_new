import {BaseController} from "../../../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../../helper";
import {guard} from "../../../../helper/Auth";
import { Messages } from "../../../../constants";
import { IColorMaster } from "./color-master.types";
import ColorRangeBusiness from "../color-range/color-range.business";
import ColorMasterBusiness from "./color-master.business";
import { ColorMasterRepository } from "./color-master.repository";
import { ColorMasterValidation } from "./color-master.validation";

export class ColorMasterController extends BaseController<IColorMaster> {
    constructor() {
        super(new ColorMasterBusiness(), "colorMaster", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/color-master',guard, this.router);
    }

    init() {
        const validation: ColorMasterValidation = new ColorMasterValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/" , validation.createColorMaster, TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/" , TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", guard, TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        res.locals = await new ColorMasterRepository().create(body, loggedInUserId)
        if(res.locals.message === "Create Successful") await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
        else await JsonResponse.jsonError(req, res, `{this.url}.create`);
    }
}