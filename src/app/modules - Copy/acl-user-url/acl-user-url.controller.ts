import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import AclUserUrlBusiness from "./acl-user-url.business";
import {IAclUserUrl} from "./acl-user-url.types";
import {AclUserUrlValidation} from "./acl-user-url.validation";

export class AclUserUrlController extends BaseController<IAclUserUrl> {
    constructor() {
        super(new AclUserUrlBusiness(), "acl-user-url");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/acl-user-url', guard, this.router);
    }

    init() {
        const validation: AclUserUrlValidation = new AclUserUrlValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createAclUserUrl, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateAclUserUrl, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}