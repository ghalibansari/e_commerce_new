import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {skuColorTypeEnum} from "../sku/sku.types";


export  class InfinityPriceNewValidation {

    async add(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Joi.object({
            infinityPriceMasterId:  Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_INFINITY_PRICE_MASTER_ID)),
            price: Joi.number().required(),
            effectiveDate: Joi.string().required(),
            stoneType: Joi.string().valid(...Object.values(skuColorTypeEnum)).required(),
            loggedInUser: Joi.any(),
        }).validateAsync(req.body, {abortEarly: false}).then(()=>next())
        .catch(async(err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res)})
    }

    async addBulk(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Joi.object({
            newData: Joi.array().items(Joi.object({
                infinityPriceMasterId:  Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_INFINITY_PRICE_MASTER_ID)),
                price: Joi.number().required(),
                effectiveDate: Joi.string().required(),
                stoneType: Joi.string().valid(...Object.values(skuColorTypeEnum)).required(),
            })),
            loggedInUser: Joi.any(),
        }).validateAsync(req.body, {abortEarly: false}).then(()=>next())
        .catch(async(err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res)})
    }


    // async filterCriteria(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try{
    //         let Schema = Joi.object({
    //             column: Joi.array().items(Joi.string()).required()
    //         });
    //         await Schema.validateAsync(req.query, {abortEarly: false})
    //         next();
    //     }
    //     catch(err){
    //         res.locals = {status: false, message: err.message}
    //         await JsonResponse.jsonError(req, res);
    //     }
    // }

    // async combinationArrayFancyIndex(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     await Joi.object({
    //         filters: Joi.array(),
    //         sliders: Joi.any(),
    //         search: Joi.string(),
    //         sort: Joi.any(),
    //         pageNumber: Joi.number().min(1),
    //         pageSize: Joi.number().min(1),
    //         column: Joi.array().items(Joi.string()),
    //         stoneType: Joi.string().valid(skuColorTypeEnum.FANCY, skuColorTypeEnum.OFF_WHITE).required()
    //     })
    //         .validateAsync(req.query, {abortEarly: false}).then(()=>next())
    //         .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    // }
}
