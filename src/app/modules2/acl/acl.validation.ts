import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import {Messages, Regex} from "../../constants"
import {JsonResponse} from "../../helper"



export class AclValidation {

    async createAcl(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
                userId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("userId: Invalid ObjectId")),
                module: Joi.string().min(3).max(50).required(),
                url: Joi.string().min(3).max(250).required(),
                viewAll: Joi.boolean(),
                viewOne: Joi.boolean(),
                add: Joi.boolean(),
                edit: Joi.boolean(),
                delete: Joi.boolean(),
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

    async updateAcl(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
                userId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("userId: Invalid ObjectId")),
                // module: Joi.string().min(3).max(50).required(),
                // url: Joi.string().min(3).max(250).required(),
                viewAll: Joi.boolean(),
                viewOne: Joi.boolean(),
                add: Joi.boolean(),
                edit: Joi.boolean(),
                delete: Joi.boolean(),
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