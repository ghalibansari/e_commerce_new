import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import {Messages, Regex} from "../../constants"
import {JsonResponse} from "../../helper"



export class AclUrlValidation {

    async createAclUrl(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                moduleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid moduleId")),
                urlName: Joi.string().max(250).required(),
                urlMethod: Joi.string().min(3).max(6).required(),
                url: Joi.string().max(250).required(),
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

    async updateAclUrl(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                moduleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid moduleId")),
                urlName: Joi.string().max(250).required(),
                urlMethod: Joi.string().min(3).max(6).required(),
                url: Joi.string().max(250).required(),
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