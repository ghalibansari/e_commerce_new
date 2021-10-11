import {Errors, Messages, Regex} from "../../../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../../../helper";
import {IInfinityPriceMaster} from "./infinity-price-master.types";


export  class InfinityPriceMasterValidation {

    async add(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Joi.object<IInfinityPriceMaster>({
            caratRangeMasterId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_CARAT_PRICE_MASTER_ID)),
            colorMasterId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COLOR_MASTER_ID)),
            clarityMasterId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_CLARITY_MASTER_ID)),
            //@ts-expect-error
            loggedInUser: Joi.any(),
        }).validateAsync(req.body, {abortEarly: false}).then(()=>next())
            .catch(async (err)=>{ res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res)})

    }
}