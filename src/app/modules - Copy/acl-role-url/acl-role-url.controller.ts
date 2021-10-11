import {BaseController} from "../BaseController";
import {Application} from "express";
import {TryCatch} from "../../helper";
import {UserValidation} from "../user/user.validation"
import {guard} from "../../helper/Auth";
import AclRoleUrlBusiness from "./acl-role-url.business";
import {IAclRoleUrl} from "./acl-role-url.types";
import {AclRoleUrlValidation} from "./acl-role-url-validation";

export class AclRoleUrlController extends BaseController<IAclRoleUrl> {
    constructor() {
        super(new AclRoleUrlBusiness(), "acl-role-url");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/acl-role-url', guard, this.router);
    }

    init() {
        const validation: AclRoleUrlValidation = new AclRoleUrlValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createAclRoleUrl, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateAclRoleUrl, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}