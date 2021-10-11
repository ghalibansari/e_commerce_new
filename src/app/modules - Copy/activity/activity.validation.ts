import {Messages, Regex} from "../../constants";
import Joi, { string } from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


export  class ActivityValidation {

    async createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                price: Joi.number().required(),
                rapprice: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid RapPriceId")),
                clientPrice: Joi.number().required(),
                skuId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid SkuId")),
                clientDiscount: Joi.number().required(),
                iav: Joi.number().required(),
                drv: Joi.number().required(),
                pwv: Joi.number().required(),
                ipcId: Joi.string().regex(Regex.mongoObjectId).error(new Error("Invalid InfinityPCId")),
                cpcId: Joi.string().regex(Regex.mongoObjectId).error(new Error("Invalid CompanyPCId")),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals.data = {validation: false, isValid: false, validationError: err.message};
            res.locals.message = Messages.VALIDATION_ERROR;
            await JsonResponse.jsonError(req, res);
        }
    }
}