import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


export  class RapPriceValidationValidation {

    async getPrices(req: Request, res: Response, next: NextFunction): Promise<void> {
        let Schema = Joi.array().required().items({
            reportNumber: Joi.allow().required(),
            color: Joi.string().required(),
            shape: Joi.string().required(),
            clarity: Joi.string().required(),
            carat_weight: Joi.number().required(),
        });
        await Schema.validateAsync(req.body, { abortEarly: false }).then(() => next())
            .catch(async (err) => { res.locals = { status: false, message: err.message }; await JsonResponse.jsonError(req, res); })
    }
    

    async updateSku(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                infinityRefId: Joi.string().max(50).required(),
                dmGuid: Joi.string().max(250).required(),
                infinityShape: Joi.string().max(250).required(),
                clientShape: Joi.string().max(250).required(),
                labShape: Joi.string().max(250).required(),
                shape: Joi.string().max(250).required(),
                labsId: Joi.any().required(),
                weight: Joi.number().required(),
                colorCategory: Joi.string().max(250).required(),
                colorSubCategory: Joi.string().max(250).required(),
                gradeReportColor: Joi.string().max(250).required(),
                colorRapnet: Joi.string().max(250).required(),
                clarity: Joi.string().max(250).required(),
                cut: Joi.string().max(250).required(),
                measurement: Joi.string().max(250).required(),
                colorType: Joi.string().max(250).required(),
                comments: Joi.any().required(),
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("addressId: Invalid ObjectId")),
                rfid: Joi.string().max(250).required(),
                polish: Joi.string().max(250).required(),
                tagId: Joi.string().max(50).required(),
                movementStatus: Joi.string(),
                status: Joi.string(),
                symmetry: Joi.string().max(250).required(),
                fluorescence: Joi.string().max(250).required(),
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

    async importSku(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                skus: Joi.any().required(),
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

    async moveToCollateralSku(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                skuIds: Joi.array().required(),
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

    async skuStatusValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                skuIds: Joi.array().required(),
                status: Joi.string().required(),
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
