import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


export  class StoneTypeMasterValidation {

    async createStoneTypeMaster(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                type: Joi.string().required(),
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

    async updateStoneTypeMaster(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                type: Joi.string().required(),
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