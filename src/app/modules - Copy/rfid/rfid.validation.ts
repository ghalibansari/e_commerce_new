import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {Messages, Regex} from "../../constants";
import {JsonResponse} from "../../helper";


export  class RfidValidation {

    async createRfid(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let Schema = Joi.object({
                rfid: Joi.any().required(),
                skuId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("skuId: Invalid ObjectId")),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, {abortEarly: false})
            next();
        } catch (err) {
            res.locals = {
                status: false,
                message: Messages.VALIDATION_ERROR,
                data: {validation: false, isValid: false, validationError: err.message}
            }
            await JsonResponse.jsonError(req, res);
        }
    }

    async getBySku(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let Schema = Joi.object({
                skuId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("skuId: Invalid ObjectId")),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.query, {abortEarly: false})
            next();
        } catch (err) {
            res.locals = {
                status: false,
                message: Messages.VALIDATION_ERROR,
                data: {validation: false, isValid: false, validationError: err.message}
            }
            await JsonResponse.jsonError(req, res);
        }
    }
}