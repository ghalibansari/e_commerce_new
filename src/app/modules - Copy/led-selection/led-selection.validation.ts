import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";

export  class LedSelectionValidation {

    async removeLedSelection(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                ledSelectionIds: Joi.string().required(),
                filters: Joi.any(),
                loggedInUser: Joi.any()
            })
            await Schema.validateAsync(req.query, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }

    async updateledSelection(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid ObjectId")),
                clientRefId: Joi.array().items(Joi.string().required()),
                comments: Joi.string().required().allow(""),
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
                lifeTime: Joi.date().allow(null),
                tagCount: Joi.number().required(),
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