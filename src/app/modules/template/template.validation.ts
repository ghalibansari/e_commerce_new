import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { ITemplate, templateTypeEnum } from "./template.types";


export abstract class TemplateValidation extends BaseValidation {
    static readonly addTemplate = Joi.object<ITemplate>({
        name: Joi.string().min(3).max(100).required(),
        to:Joi.string(),
        cc:Joi.string(),
        bcc:Joi.string(),
        title: Joi.string().min(3).max(100).required(),
        subject: Joi.string().email().required(),
        body: Joi.string().required(),
        params: Joi.array().items(Joi.string()).required(),
        type: Joi.string().required().valid(...Object.values(templateTypeEnum)),
    });

    static readonly addTemplateBulk = Joi.array().items(this.addTemplate);

    static readonly editTemplate = Joi.object<ITemplate>({
        to:Joi.string(),
        cc:Joi.string(),
        bcc:Joi.string(),
        title: Joi.string().min(3).max(100),
        name: Joi.string().min(3).max(100),
        subject: Joi.string().email(),
        body: Joi.string().required(),
        params: Joi.array().items(Joi.string()).required(),
        type: Joi.string().valid(...Object.values(templateTypeEnum)),
    });
};