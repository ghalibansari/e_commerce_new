import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import { values } from "lodash";


const createIavSchema = Joi.object({
    filters: Joi.string().required(),
    updateCollateral: Joi.bool().default("false"),
    iav: Joi.number().required(),
    effectiveDate: Joi.string().required(),
    importReview: Joi.bool(),
});




export  class IavValidation {
    async createIav(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            await createIavSchema.validateAsync(req.query, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }

}