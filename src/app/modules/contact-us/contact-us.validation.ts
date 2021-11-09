import Joi, { required } from "joi";
import { BaseValidation } from "../BaseValidation";
import { IContactUs } from "./contact-us.type";

export abstract class ContactUsValidation extends BaseValidation {
    static readonly addContactUs = Joi.object<IContactUs>({
        name: Joi.string().required(),
        email: Joi.string().required(),
        contact_no: Joi.string().required(),
        message: Joi.string().required()
        });

    static readonly addContactUsBulk = Joi.array().items(this.addContactUs)

    static readonly editContactUs = Joi.object<IContactUs>({
        name: Joi.string(),
        email: Joi.string(),
        contact_no: Joi.string(),
        message: Joi.string()
    });
};