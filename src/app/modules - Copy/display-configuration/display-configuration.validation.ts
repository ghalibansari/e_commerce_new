import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {enumAlignment} from "./diaplay-configuration.types";


const config = {
    valKey: Joi.string().required().error(new Error("Invalid DBField")),
    text: Joi.string(),
    align: Joi.allow(...Object.values(enumAlignment)),
    sequence: Joi.number().positive().min(1).max(50).error(new Error("Invalid Sequence")),
    preFix: Joi.string().allow(""),
    postFix: Joi.string().allow(""),
    isActive: Joi.bool(),
    isDeleted: Joi.bool(),
}

const addDisplayConfigurationSchema = {
    companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid companyId")),
    roleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid roleId")),
    screen: Joi.string().max(50).required(),
    config: Joi.array().items(Joi.object(config)),
    loggedInUser: Joi.any(),
}

const editDisplayConfigurationSchema = {
    _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid _id")),
    companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid companyId")),
    roleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid roleId")),
    screen: Joi.string().max(50).required(),
    config: Joi.array().items(Joi.object(config)),
    loggedInUser: Joi.any(),
}

export  class DisplayConfigurationValidation {

    async add(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Joi.object(addDisplayConfigurationSchema)
        .validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Joi.object(editDisplayConfigurationSchema)
        .validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async editBulk(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Joi.object({data: Joi.array().items(editDisplayConfigurationSchema), loggedInUser: Joi.any(),})
        .validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }
}