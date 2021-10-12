import {BaseController} from "../BaseController";
import {Application} from "express";
import {TryCatch} from "../../helper";
import AclModuleBusiness from "./acl-module.business";
import {guard} from "../../helper/Auth";
import {IAclModule} from "./acl-module.types";
import {AclModuleValidation} from "./acl-module.validation";

export class AclModuleController extends BaseController<IAclModule> {
    constructor() {
        super(new AclModuleBusiness(), "acl-module");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/acl-module', guard, this.router)
    }

    init() {
        const validation: AclModuleValidation = new AclModuleValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createAclModule, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateAclModule, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}