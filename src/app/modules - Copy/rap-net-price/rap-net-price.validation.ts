import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


export  class RapNetPriceValidationValidation {

    async createRapNetPrice(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
               rapNetData: Joi.array().items({
                    weight: Joi.number().required(),
                    color: Joi.string().min(1).max(2).required(),
                    shape: Joi.string().max(50).required(),
                    clarity: Joi.string().max(20).required(),
                    rapList: Joi.number(),
                    effectiveDate: Joi.string().required(),
                    rapNetDiscount: Joi.number(),
                    rapNetBestPriceDiscount:Joi.number(),
                    rapNetAvgPriceDiscount:Joi.number(),
                    rapNetBestPrice:Joi.number(),
                    rapNetAvgPrice:Joi.number(),
                    weightRange:Joi.object({
                        fromWeight: Joi.number().required(),
                        toWeight: Joi.number().required()
                    }),
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
}
