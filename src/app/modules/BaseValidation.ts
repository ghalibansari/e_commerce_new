import Joi from "joi";
import { validate } from 'uuid';


export const idValidate = (value: string, helper: any) => {
    if (!validate(value)) return helper.message("Invalid id.");
    return true;
};


export abstract class BaseValidation {

    static readonly index = Joi.object({
        where: Joi.object(),
        attributes: Joi.array().items(Joi.string().required()),
        pageNumber: Joi.number().min(1).max(999).error(new Error("Invalid pageNumber")),
        pageSize: Joi.number().min(1).max(1000).error(new Error("Invalid pageSize")),
        rangeFilters: Joi.string().error(new Error("Invalid Query rangeFilters")),
        order: Joi.array().items(Joi.string()).error(new Error("Invalid sort")),
        search: Joi.string().max(55).error(new Error("Invalid search"))
    });

    static readonly attributes = Joi.object({
        attributes: Joi.array().items(Joi.string().required())
    });

    static readonly findById = Joi.object({
        id: Joi.string().custom(idValidate)
    });

    static readonly delete_reason = Joi.object({
        delete_reason: Joi.string().required().max(250)
    });
};