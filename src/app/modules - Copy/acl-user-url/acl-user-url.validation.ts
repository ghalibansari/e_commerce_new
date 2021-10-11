import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import {Messages, Regex} from "../../constants"
import {JsonResponse} from "../../helper"



export class AclUserUrlValidation {

    async createAclUserUrl(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                userId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid moduleId")),
                urlId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid urlId")),
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

    async updateAclUserUrl(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                userId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid moduleId")),
                urlId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid urlId")),
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