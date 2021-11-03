import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { PincodeRepository } from "./pincodes.repository";
import { IMPincode, IPincode } from "./pincodes.types";
import { PincodeValidation } from "./pincodes.validation";


export class PincodeController extends BaseController<IPincode, IMPincode> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("pincode", new PincodeRepository(), ['pincode_id', 'area_name', 'is_active'], [['area_name', 'DESC']], [])
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(PincodeValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(PincodeValidation.addPincodes), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(PincodeValidation.addPincodeBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(PincodeValidation.findById), validateBody(PincodeValidation.editPincode), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(PincodeValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
