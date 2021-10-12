import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import {Messages, Regex} from "../../constants"
import {JsonResponse} from "../../helper"



export class AclModuleValidation {

    async createAclModule(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                moduleName: Joi.string().max(250).required(),
                moduleUrl: Joi.string().max(250).required(),
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

    async updateAclModule(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                moduleName: Joi.string().max(250).required(),
                moduleUrl: Joi.string().max(250).required(),
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