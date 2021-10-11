import {BaseController} from "../../../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../../helper";
import {guard} from "../../../../helper/Auth";
import { Messages } from "../../../../constants";
import MeasurementsMasterBusiness from "./measurements-master.business";
import { IMeasurementsMaster } from "./measurements-master.types";
import { MeasurementsMasterValidation } from "./measurements-master.validation";

export class MeasurementsMasterController extends BaseController<IMeasurementsMaster> {
    constructor() {
        super(new MeasurementsMasterBusiness(), "measurementMaster", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/measurement-master',guard, this.router);
    }

    init() {
        const validation: MeasurementsMasterValidation = new MeasurementsMasterValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/" , validation.createMeasurementMaster, TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/" , validation.updateMeasurementMaster, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    // create = async(req: Request, res: Response): Promise<void> => {
    //     res.locals = {status: false, message: Messages.CREATE_FAILED}
    //     let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
    //     body.createdBy = body.updatedBy = loggedInUserId
    //     const data = await new StoneTypeMasterRepository().create(body)
    //     res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    // }

    // update = async(req: Request, res: Response): Promise<void> => {
    //     res.locals = {status: false, message: Messages.UPDATE_FAILED}
    //     let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
    //     body.updatedBy = loggedInUserId
    //     const data = await new StoneTypeMasterRepository().update(body)
    //     res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    // }
}