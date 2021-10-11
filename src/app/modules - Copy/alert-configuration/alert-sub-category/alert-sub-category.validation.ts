import {Errors, Messages, Regex} from "../../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../../helper";


export  class AlertSubCategoryValidation {

    async createSubAlertCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const Schema = Joi.object({
                alertCategoryId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error('Invalid alertCategoryId')),
                subCategory: Joi.string().required(),
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

    async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
                alertCategoryId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error('Invalid alertCategoryId')),
                subCategory: Joi.string().required(),
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