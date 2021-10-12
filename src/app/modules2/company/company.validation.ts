import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {createAddressSchemaObject} from "../address/address.validation";
import {createContactSchemaObject} from "../contact/contact.validation";



export  class CompanyValidation {

    async createCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            name: Joi.string().max(250).required(),
            address: Joi.object(createAddressSchemaObject).required(),
            contacts: Joi.array().items(createContactSchemaObject).required(),
            logoUrl: Joi.string().required(),
            companyTypeId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_TYPE_ID)),
            companySubTypeId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_SUB_TYPE_ID)),
            parentId: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_PARENT_COMPANY_ID)),
            attributes: Joi.any(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async updateCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
            name: Joi.string().max(250).required(),
            address: Joi.object(createAddressSchemaObject).required(),
            contacts: Joi.array().items(createContactSchemaObject).required(),
            logoUrl: Joi.string().required(),
            companyTypeId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_TYPE_ID)),
            companySubTypeId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_SUB_TYPE_ID)),
            parentId: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_PARENT_COMPANY_ID)),
            attributes: Joi.any(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }
}