import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IEnquiry } from "./enquiry.type";

export abstract class ContactUsValidation extends BaseValidation {
    static readonly addContactUs = Joi.object<IEnquiry>({
        name: Joi.string().required(),
        email: Joi.string().required(),
        contact_no: Joi.string().required(),
        message: Joi.string().required()
    });

    static readonly addContactUsBulk = Joi.array().items(this.addContactUs)

    static readonly editContactUs = Joi.object<IEnquiry>({
        name: Joi.string(),
        email: Joi.string(),
        contact_no: Joi.string(),
        message: Joi.string()
    });
};