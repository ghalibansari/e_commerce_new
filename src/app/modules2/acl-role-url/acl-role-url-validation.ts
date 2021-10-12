import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import {Messages, Regex} from "../../constants"
import {JsonResponse} from "../../helper"



export class AclRoleUrlValidation {

    async createAclRoleUrl(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                roleId: Joi.string().required(),    //Todo fix this id
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

    async updateAclRoleUrl(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                roleId: Joi.string().required(),
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