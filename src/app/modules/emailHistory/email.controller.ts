import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { EmailRepository } from "./email.repository";
import { IEmail, IMEmail } from "./email.types";
import { EmailValidation } from "./email.validation";


export class EmailController extends BaseController<IEmail, IMEmail> {
    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("email", new EmailRepository(), ['email_id', "to", "from", "html", "subject", 'is_active'], [["to", 'DESC']], [],)
        this.init()
    };

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(EmailValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(EmailValidation.addEmail), TryCatch.tryCatchGlobe(this.createOneBC))
        // this.router.put("/:id", validateParams(EmailValidation.findById), validateBody(EmailValidation.editEmail), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(EmailValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
