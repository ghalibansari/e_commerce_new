import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";

export  class RoleValidation {

    async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                code: Joi.string().max(250).required(),
                shortDescription: Joi.string().required(),
                longDescription: Joi.string().required(),
                companyTypeId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid companyTypeId")),
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

    async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid ObjectId")),
                code: Joi.string().max(250).required(),
                shortDescription: Joi.string().required(),
                longDescription: Joi.string().required(),
                companyTypeId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid companyTypeId")),
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