import {BaseController} from "../BaseController";
import {Application} from "express";
import {TryCatch} from "../../helper";
import SkuBusiness from "./lab.business";
import {guard} from "../../helper/Auth";
import {ILab} from "./lab.types";
import {LabValidation} from "./lab.validation";

export class LabController extends BaseController<ILab> {
    constructor() {
        super(new SkuBusiness(), "lab");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/lab', guard, this.router);
    }

    init() {   //Todo write validation
        const validation: LabValidation = new LabValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createLab, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateLab, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }
}