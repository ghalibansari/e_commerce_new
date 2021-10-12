import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {createAddressSchemaObject, updateAddressSchemaObject} from "../address/address.validation";
import {giaKeyEnum, ISetting} from "./setting.types";
import {attributeJoiScheme} from "../attribute/attribute.validation";


const createSettingsSchemaObject = {
    giaProductionKey: Joi.string().max(250).required(),
    giaSandBoxKey: Joi.string().max(250).required(),
    EmailId: Joi.string().email().max(250).required(),
    password: Joi.string().max(250).required().regex(Regex.passwordRegex).error(new Error(Errors.PASSWORD)),
    cdnUrl: Joi.string().max(250).required(),
    masterPassword:Joi.string().required(),
    powerBiUrl:Joi.string().required(),
    giaKey: Joi.string().valid(...Object.values(giaKeyEnum)).max(250).required(),
    loggedInUser: Joi.any(),    //Todo create proper object validation for loggedInUser...
};

export const updateSettingSchemaObject = {
    _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
    giaProductionKey: Joi.string().max(250).required(),
    giaSandBoxKey: Joi.string().max(250).required(),
    EmailId: Joi.string().email().max(250).required(),
    EmailPassword: Joi.string().max(250).required().regex(Regex.passwordRegex).error(new Error(Errors.PASSWORD)),
    EmailHost: Joi.string().max(250).required(),
    EmailPort: Joi.number().max(65590).required(),
    EmailSecure: Joi.bool().required(),
    EmailFrom: Joi.string().max(250).required(),
    EmailTo: Joi.string().max(250).required(),
    MailSender: Joi.string().max(250).required(),
    cdnUrl: Joi.string().max(250).required(),
    masterPassword:Joi.string().required(),
    powerBiUrl:Joi.string().required(),
    giaKey: Joi.string().valid(...Object.values(giaKeyEnum)).max(250).required(),
    defaultPageSize: Joi.number().min(1).max(1000).required(),
    loggedInUser: Joi.any(),
}


export  class SettingValidation {
    async createSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Joi.object<ISetting>(createSettingsSchemaObject)    //Todo implement Joi.object<ISettings> type in every validation
        .validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async updateSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Joi.object<ISetting>(updateSettingSchemaObject)
        .validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }
}
