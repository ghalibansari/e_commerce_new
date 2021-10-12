import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {IAttribute} from "../attribute/attribute.types";
import {attributeJoiScheme} from "../attribute/attribute.validation";
import {IAddress} from "./address.types";


export const createAddressSchemaObject = {
    address1: Joi.string().min(5).max(250),
    address2: Joi.string().min(5).max(250),
    city: Joi.string().min(3).max(50),
    state: Joi.string().min(3).max(50),
    zipCode: Joi.string(),   //Todo add max limit
    country: Joi.string().min(3).max(50),
    attributes: Joi.array().items(attributeJoiScheme),//Todo fix this with proper array of object validation.
    loggedInUser: Joi.any(),
};

export const updateAddressSchemaObject = {
    _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
    address1: Joi.string().min(5).max(250).required(),
    address2: Joi.string().min(5).max(250).required(),
    city: Joi.string().min(3).max(50).required(),
    state: Joi.string().min(3).max(50).required(),
    zipCode: Joi.string().required(),
    country: Joi.string().min(3).max(50).required(),
    loggedInUser: Joi.any(),
}

export const createuserAddressSchemaObject = { //Todo add proper validation for this
    address1: Joi.string().allow(""),
    address2: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    zipCode: Joi.string().allow(""),   //Todo add max limit
    country: Joi.string().allow(""),
    attributes: Joi.array().items(attributeJoiScheme),//Todo fix this with proper array of object validation.
    loggedInUser: Joi.any(),
};


export  class AddressValidation {
    async createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object<IAddress>(createAddressSchemaObject)
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object(updateAddressSchemaObject);
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }
}