import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IEmailHistory } from "./email-history.types";


export abstract class EmailHistoryValidation extends BaseValidation {
    static readonly addEmail = Joi.object<IEmailHistory>({
        to: Joi.string().email().required(),
        from: Joi.string().email().required(),
        html: Joi.string().required(),
        subject: Joi.string().required(),
        cc: Joi.string(),
        bcc: Joi.string(),
        attachment: Joi.string(),
        error: Joi.string()
    });


    static readonly editEmail = Joi.object<IEmailHistory>({
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