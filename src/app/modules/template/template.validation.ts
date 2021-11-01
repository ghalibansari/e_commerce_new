import Joi from "joi";
import { ITemplate } from "./template.types";


export class TemplateValidation {
    static readonly addTemplate = Joi.object<ITemplate>({
        title: Joi.string().min(3).max(100).required(),
        slug: Joi.string().min(3).max(100).required(),
        subject: Joi.string().email().required(),
        body: Joi.string().required(),
        params: Joi.string().min(8).max(100).required(),
        type: Joi.string().required(),
        created_by: Joi.any(),
        updated_by: Joi.any()
    });

    static readonly editTemplate = Joi.object<ITemplate>({
        title: Joi.string().min(3).max(100).required(),
        slug: Joi.string().min(3).max(100).required(),
        subject: Joi.string().email().required(),
        body: Joi.string().required(),
        params: Joi.string().min(8).max(100).required(),
        type: Joi.string().required(),
    });

}