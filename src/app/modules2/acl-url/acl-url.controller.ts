import {BaseController} from "../BaseController";
import {Application} from "express";
import {TryCatch} from "../../helper";
import {UserValidation} from "../user/user.validation"
import {guard} from "../../helper/Auth";
import AclUrlBusiness from "./acl-url.business";
import {IAclUrl} from "./acl-url.types";
import {AclUrlValidation} from "./acl-url.validation";

export class AclUrlController extends BaseController<IAclUrl> {
    constructor() {
        super(new AclUrlBusiness(), "acl-url");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/acl-url', guard, this.router);
    }

    init() {
        const validation: AclUrlValidation = new AclUrlValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createAclUrl, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateAclUrl, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}