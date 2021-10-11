import {Messages, Regex, Errors} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


export  class SkuDisplayConfigurationValidation {

    async add(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
                roleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ROLE_ID)),
                userId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_USER_ID)),
                value: Joi.string().required(),
                sequence: Joi.number().max(50).required(),
                preFix: Joi.string().max(5),
                postFix: Joi.string().max(5),
                alignment: Joi.string().valid('right', 'center', 'left', null),
                dbField: Joi.string().max(50).required(),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonSuccess(req, res);
        }
    }

    async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid _id")),
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
                roleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ROLE_ID)),
                userId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_USER_ID)),
                value: Joi.string().required(),
                sequence: Joi.number().max(50).required(),
                preFix: Joi.string().max(5),
                postFix: Joi.string().max(5),
                alignment: Joi.string().valid('right', 'center', 'left', null),
                dbField: Joi.string().max(50).required(),
                loggedInUser: Joi.any(),
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