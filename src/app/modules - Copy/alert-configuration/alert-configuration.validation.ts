import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import { description } from "joi";


export  class AlertConfigurationValidation {

    async createAlertConfiguration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                category: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ALERT_CATEGORY_ID)).required(),
                subCategory: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ALERT_SUB_CATEGORY_ID)).required(),
                level: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ALERT_LEVEL_ID)).required(),
                type: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ALERT_TYPE_ID))).required(),
                reciever: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_RECIEVER))).required(),
                cc: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_CC))).required(),
                frequency: Joi.string(),
                schedule: Joi.array().items(Joi.string().required()),
                scheduleTime: Joi.string().regex(Regex.scheduleTime).allow(null).error(new Error(Errors.INVALID_SCHEDULE_TIME)),
                message: Joi.string().required(),
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

    async updateAlertConfiguration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ALERT_CATEGORY_ID)).required(),
                category: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ALERT_CATEGORY_ID)).required(),
                subCategory: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ALERT_SUB_CATEGORY_ID)).required(),
                level: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ALERT_LEVEL_ID)).required(),
                type: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ALERT_TYPE_ID))).required(),
                reciever: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_RECIEVER))).required(),
                cc: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_CC))).required(),
                frequency: Joi.string(),
                schedule: Joi.array().items(Joi.string().required()),
                scheduleTime: Joi.string().regex(Regex.scheduleTime).allow(null).error(new Error(Errors.INVALID_SCHEDULE_TIME)),
                message: Joi.string().required(),
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

    // async updateAlertMaster(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try{
    //         let Schema = Joi.object({
    //             _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
    //             code: Joi.string(),
    //             description: Joi.string(),
    //             alertType: Joi.string(),
    //             status: Joi.string().valid('HIGH', 'MEDIUM', 'LOW'),
    //             priority: Joi.string(),
    //             loggedInUser: Joi.any(),
    //         });
    //         await Schema.validateAsync(req.body, {abortEarly: false})
    //         next();
    //     }
    //     catch(err){
    //         res.locals = {status: false, message: err.message}
    //         await JsonResponse.jsonError(req, res);
    //     }
    // }
}