import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {skuColorTypeEnum} from "../sku/sku.types";


export  class InfinityPriceValidation {

    async createInfinityPrice(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
               infinityPriceData: Joi.array().items({
                    colorRangeId: Joi.string().required(),
                    fluorescenseId: Joi.any(),
                    stoneTypeId: Joi.string().required(),
                    clarityRangeId: Joi.string().required(),
                    weightRangeId: Joi.string().required(),
                    effectiveDate: Joi.string().required(),
                    price:Joi.number().required()
                }).required(),
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


    async filterCriteria(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                column: Joi.array().items(Joi.string()).required()
            });
            await Schema.validateAsync(req.query, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }

    async combinationArrayFancyIndex(req: Request, res: Response, next: NextFunction): Promise<void> {
        await Joi.object({
            filters: Joi.array(),
            sliders: Joi.any(),
            search: Joi.string(),
            sort: Joi.any(),
            pageNumber: Joi.number().min(1),
            pageSize: Joi.number().min(1),
            column: Joi.array().items(Joi.string()),
            stoneType: Joi.string().valid(skuColorTypeEnum.FANCY, skuColorTypeEnum.OFF_WHITE).required()
        })
            .validateAsync(req.query, {abortEarly: false}).then(()=>next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }
}
