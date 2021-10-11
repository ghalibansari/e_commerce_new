import {BaseController} from "../../../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../../helper";
import {guard} from "../../../../helper/Auth";
import { ICaratMaster } from "./carat-master.types";
import CaratMasterBusiness from "./carat-master.business";
import { Messages } from "../../../../constants";
import { CaratMasterRepository } from "./carat-master.repository";
import { CaratMasterValidation } from "./carat-master.validation";

export class CaratMasterController extends BaseController<ICaratMaster> {
    constructor() {
        super(new CaratMasterBusiness(), "caratMaster", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/carat-master',guard, this.router);
    }

    init() {
        const validation: CaratMasterValidation = new CaratMasterValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/" , TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/" , validation.updatecaratMaster, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", guard, TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        if(body.fromCarat > body.toCarat) throw new Error("fromWeight should be less then toWeight")
        res.locals = await new CaratMasterRepository().create(body, loggedInUserId)
        if(res.locals.message === "Create Successful") await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
        else await JsonResponse.jsonError(req, res, `{this.url}.create`);
    }
}