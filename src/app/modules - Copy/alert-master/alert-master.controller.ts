import {BaseController} from "../BaseController";
import {Application} from "express";
import {TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import AlertMasterBusiness from "./alert-master.business";
import {AlertMasterValidation} from "./alert-master.validation"
import {IAlertMaster} from "./alert-master.types"

export class AlertMasterController extends BaseController<IAlertMaster> {
    constructor() {
        super(new AlertMasterBusiness(), "alertMaster", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/alert-master',guard, this.router);
    }

    init() {
        const validation: AlertMasterValidation = new AlertMasterValidation();
        this.router.get("/",  TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createAlertMaster ,  TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateAlertMaster ,  TryCatch.tryCatchGlobe(this.updateBC));
        // this.router.delete("/", guard, TryCatch.tryCatchGlobe(this.deleteBC));   // delete is not required in this module
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }
}