import { Application } from "express";
import { AuthGuard } from "../../helper";
import { BaseController } from "../BaseController";
import { EmailHistoryRepository } from "./email-history.repository";
import { IEmailHistory, IMEmailHistory } from "./email-history.types";


export class EmailHistoryController extends BaseController<IEmailHistory, IMEmailHistory> {
    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("email-history", new EmailHistoryRepository(), ['email_id', "to", "from", "html", "subject", 'is_active'], [["to", 'DESC']], [],)
        this.init()
    };

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router);

    init() {
        // this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(EmailHistoryValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        // this.router.post("/", validateBody(EmailHistoryValidation.addEmail), TryCatch.tryCatchGlobe(this.createOneBC))
        // this.router.put("/:id", validateParams(EmailValidation.findById), validateBody(EmailValidation.editEmail), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(EmailValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
