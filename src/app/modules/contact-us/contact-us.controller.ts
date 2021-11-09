import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { ContactUsRepository } from "./contact-us.repository";
import { IContactUs,IMContactUs  } from "./contact-us.type";
import { ContactUsValidation } from "./contact-us.validation";


export class ContactUsController extends BaseController<IContactUs, IMContactUs> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("contact-us", new ContactUsRepository(), ['contact_id', 'name', 'email', 'contact_no', 'message'], [['name', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(ContactUsValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(ContactUsValidation.addContactUs), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(ContactUsValidation.addContactUsBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(ContactUsValidation.findById), validateBody(ContactUsValidation.editContactUs), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(ContactUsValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
