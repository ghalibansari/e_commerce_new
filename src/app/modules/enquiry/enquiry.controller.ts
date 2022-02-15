import { Application } from "express";
import { AuthGuard, TryCatch, validateBody } from "../../helper";
import { BaseController } from "../BaseController";
import { EnquiryRepository } from "./enquiry.repository";
import { IEnquiry, IMEnquiry } from "./enquiry.type";
import { ContactUsValidation } from "./enquiry.validation";


export class ContactUsController extends BaseController<IEnquiry, IMEnquiry> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("contact-us", new EnquiryRepository(), ['enquiry_id', 'name', 'email', 'contact_no', 'message'], [['name', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        // this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(ContactUsValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(ContactUsValidation.addContactUs), TryCatch.tryCatchGlobe(this.createOneBC))
        // this.router.post("/bulk", validateBody(ContactUsValidation.addContactUsBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(ContactUsValidation.findById), validateBody(ContactUsValidation.editContactUs), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(ContactUsValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
