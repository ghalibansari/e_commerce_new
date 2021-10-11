import {Regex} from "../../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../../helper";


const updateTransactionImportReview = Joi.object({
    skuId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("skuId: Invalid ObjectId")),
    transactionId: Joi.string().required(),
    approvedBy: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("approvedBy: Invalid ObjectId")),
    loggedInUser: Joi.any(),
});

export  class TransactionImportReviewValidation {
    async updateTransactionImportReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            await updateTransactionImportReview.validateAsync(req.body, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }

}