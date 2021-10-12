import {Messages, Regex} from "../../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../../helper";
import { description } from "joi";


export  class AlertTypeValidation {

    async createAlertType(req: Request, res: Response, next: NextFunction): Promise<void> {
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
}