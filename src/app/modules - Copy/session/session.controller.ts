import SessionBusiness from "./session.business";
import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {Messages} from "../../constants"
// import {SessionValidation} from "./session.validation"
import {guard} from "../../helper/Auth";
import {ISession} from "./session.types";
import {BaseHelper} from "../BaseHelper";
import AddressBusiness from "../address/address.business";
import RoleBusiness from "../role/role.business";
import CompanyBusiness from "../company/company.business";


export class SessionController extends BaseController<ISession>{
    constructor() {
        super(new SessionBusiness(), "session");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/session', guard, this.router);
    }

    init() {//validation
        // const validation: SessionValidation = new SessionValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.post("/", TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", TryCatch.tryCatchGlobe(this.updateBC));
        // this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}