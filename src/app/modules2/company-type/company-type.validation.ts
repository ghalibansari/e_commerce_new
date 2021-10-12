import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";

export  class CompanyTypeValidation {

    async createCompanyType(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                code: Joi.string().max(250).required(),
                shortDescription: Joi.string().required(),
                longDescription: Joi.string().required(),
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

    async updateCompanyType(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid ObjectId")),
                code: Joi.string().max(250),
                shortDescription: Joi.string(),
                longDescription: Joi.string(),
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