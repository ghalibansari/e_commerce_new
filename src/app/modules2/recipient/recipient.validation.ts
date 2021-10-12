import {Request, Response, NextFunction} from "express";
import {JsonResponse} from "../../helper";
import {Messages, Regex} from "../../constants";
import Joi from "joi";



export class RecipientValidation {

    async addValidation(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                templateId: Joi.string().required(),
                email: Joi.string().email().max(250).required(),
                type: Joi.number().required(),
                isActive: Joi.boolean().required(),
                loggedInUser: Joi.any()
            })
            await Schema.validateAsync(req.body, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonSuccess(req, res);
        }
    }

    async editValidation(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_ids: Invalid ObjectId")),
                templateId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid templateId")),
                email: Joi.string().email().max(250).required(),
                type: Joi.number().required(),
                isActive: Joi.boolean().required(),
                loggedInUser: Joi.any()
            });
            await Schema.validateAsync(req.body, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonSuccess(req, res);
        }
        
    }
}