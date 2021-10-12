import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import { description } from "joi";


export  class AlertMasterValidation {

    async createAlertMaster(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                code: Joi.string().required(),
                description: Joi.string().required(),
                alertType: Joi.string().valid('USERGENERATED' , 'SYSTEMGENERATED').required(),
                status: Joi.string().required(),
                priority: Joi.string().valid('HIGH', 'MEDIUM', 'LOW').required(),
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

    async updateAlertMaster(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                code: Joi.string(),
                description: Joi.string(),
                alertType: Joi.string(),
                status: Joi.string().valid('HIGH', 'MEDIUM', 'LOW'),
                priority: Joi.string(),
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