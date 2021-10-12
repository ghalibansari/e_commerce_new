import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";

export  class DeviceValidation {

    async createDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                name: Joi.string().max(250).required(),
                serialNumber: Joi.string().required(),
                description: Joi.string().allow(""),
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
                deviceTypeId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("deviceTypeId: Invalid ObjectId")),
                userIds: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_USER_ID))),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }

    async updateDevice(req: Request, res: Response, next: NextFunction): Promise<void> {    //Todo stop using any in joi validation in system...
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid ObjectId")),
                name: Joi.string().max(250).required(),
                serialNumber: Joi.string().required(),
                description: Joi.string().allow(""),
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
                deviceTypeId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("deviceTypeId: Invalid ObjectId")),
                userIds: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error("userIds: Invalid ObjectId"))),
                token: Joi.any(),
                isActive:Joi.boolean(),
                isDeleted: Joi.boolean(),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }
}