import {Errors, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {ISkuInfinityPrice} from "./sku-infinity-price.types";

const createLoanSchemaObject = {
    companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
    amount: Joi.number().positive().required().error(new Error(Errors.AMOUNT_ERROR)),
    loggedInUser: Joi.any(),
};


export  class SkuInfinityPriceValidation {

    // async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     const Schema = Joi.object<ISkuInfinityPrice>({...createLoanSchemaObject})
    //     await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
    //         .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    // }
    //
    // async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     const Schema = Joi.object<ISkuInfinityPrice>({
    //         _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
    //         ...createLoanSchemaObject})
    //     await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
    //         .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    // }
}
