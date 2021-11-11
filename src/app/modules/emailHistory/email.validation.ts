import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IEmail } from "./email.types";


export abstract class EmailValidation extends BaseValidation {
    static readonly addEmail = Joi.object<IEmail>({
        to: Joi.string().email().required(),
        from: Joi.string().email().required(),
        html: Joi.string().required(),
        subject: Joi.string().required(),
        cc: Joi.string(),
        bcc: Joi.string(),
        attachment: Joi.string(),
        error: Joi.string()
    });


    static readonly editEmail = Joi.object<IEmail>({
        to: Joi.string().email().required(),
        from: Joi.string().email().required(),
        html: Joi.string().required(),
        subject: Joi.string().required(),
        cc: Joi.string(),
        bcc: Joi.string(),
        attachment: Joi.string(),
        error: Joi.string(),
        is_active: Joi.boolean(),
    });
};