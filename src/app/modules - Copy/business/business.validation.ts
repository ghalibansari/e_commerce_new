import {Messages, Regex} from "../../constants";
import Joi, { string } from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


export  class CreateBusinessValidation {

    async createBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                companyId: Joi.string().regex(Regex.mongoObjectId).error(new Error("_id: Invalid companyId")).required(),
                action: Joi.string().valid("OPEN","CLOSE").required(),
                comments: Joi.string(),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync({...req.body}, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }

    async detail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).error(new Error("Invalid id")).required(),
                action: Joi.string().valid("OPEN","CLOSE").required(),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync({...req.body,...req.query}, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }
}