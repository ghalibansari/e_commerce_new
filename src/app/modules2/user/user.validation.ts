import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {createAddressSchemaObject, createuserAddressSchemaObject, updateAddressSchemaObject} from "../address/address.validation";
import {IUser, userverificationMethodEnum} from "./user.types";
import {attributeJoiScheme} from "../attribute/attribute.validation";


const createUserSchemaObject = {
    firstName: Joi.string().max(250).required().error(new Error(Errors.FIRSTNAME_ERROR)),
    lastName: Joi.string().max(250).required().error(new Error(Errors.LASTNAME_ERROR)),
    email: Joi.string().email().regex(Regex.emailRegex).required().error(new Error(Errors.INVALID_EMAIL_ID)),
    altEmail: Joi.string().email().regex(Regex.emailRegex).error(new Error(Errors.INVALID_EMAIL_ID)),
    password: Joi.string().max(250).regex(Regex.passwordRegex).error(new Error(Errors.PASSWORD)),
    phone: Joi.string().required(),
    interNationalCode: Joi.string().required().regex(Regex.phoneNumberCode).error(new Error(Errors.INVALID_PHONE_NUMBER_CODE)),
    address: Joi.object(createuserAddressSchemaObject),
    fingerPrint: Joi.string(),
    //salt: Joi.string().required(),
    roleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ROLE_ID)),
    companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
    attributes: Joi.array().items(attributeJoiScheme),
    loggedInUser: Joi.any(),
};

export const updateUserSchemaObject = {
    _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
    firstName: Joi.string().max(250).required().error(new Error(Errors.FIRSTNAME_ERROR)),
    lastName: Joi.string().max(250).required().error(new Error(Errors.LASTNAME_ERROR)),
    email: Joi.string().email().regex(Regex.emailRegex).required().error(new Error(Errors.INVALID_EMAIL_ID)),
    altEmail: Joi.string().email().regex(Regex.emailRegex).error(new Error(Errors.INVALID_EMAIL_ID)),
    password: Joi.string().max(250).regex(Regex.passwordRegex).error(new Error(Errors.PASSWORD)),
    phone: Joi.string().required(),
    interNationalCode: Joi.string().required().regex(Regex.phoneNumberCode).error(new Error(Errors.INVALID_PHONE_NUMBER_CODE)),
    address: Joi.object(createuserAddressSchemaObject),
    fingerPrint: Joi.array().items({ index: Joi.number(), data: Joi.string() }),
    badgeId: Joi.string(),
    // salt: Joi.string().required(),
    roleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ROLE_ID)),
    companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
    attributes: Joi.array().items(attributeJoiScheme),
    loggedInUser: Joi.any(),
}

export const verficationMethod = {
    userIds: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID))),
    verificationMethod: Joi.string().required().valid(userverificationMethodEnum.MOBILE, userverificationMethodEnum.EMAIL),
    loggedInUser: Joi.any(),
}


export  class UserValidation {
    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object<IUser>(createUserSchemaObject)
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object<IUser>(updateUserSchemaObject);
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async updateFingerPrint(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
            fingerPrint: Joi.array().items({ index: Joi.number(), data: Joi.string() }).required(),
            badgeId: Joi.string(),
            loggedInUser: Joi.any()
        })
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async updateVerficationMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object<IUser>(verficationMethod);
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }
}
