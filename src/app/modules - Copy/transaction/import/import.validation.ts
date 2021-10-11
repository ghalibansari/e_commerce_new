import {Messages, Regex, Errors} from "../../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../../helper";

export  class TransactionImportValidation {

    async updateReviewStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                transactionId: Joi.string().required(),
                skuIds: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_LAB_ID))),
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