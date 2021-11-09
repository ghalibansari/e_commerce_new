import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { PinCodeRepository } from "./pincode.repository";
import { IMPinCode, IPinCode } from "./pincode.types";
import { PinCodeValidation } from "./pincode.validation";


export class PinCodeController extends BaseController<IPinCode, IMPinCode> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("pin-code", new PinCodeRepository(), ['pin_code_id', 'area_name', 'is_active'], [['area_name', 'DESC']], [])
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(PinCodeValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(PinCodeValidation.addPinCodes), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(PinCodeValidation.addPinCodeBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(PinCodeValidation.findById), validateBody(PinCodeValidation.editPinCode), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(PinCodeValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
