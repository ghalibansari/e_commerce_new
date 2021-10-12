import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {indexCounter} from "../BaseValidation";


export  class AlertValidation {

    async createAlert(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                userId: Joi.string().regex(Regex.mongoObjectId).error(new Error("_id: Invalid UserId")),
                skuId: Joi.string().regex(Regex.mongoObjectId).error(new Error("_id: Invalid SkuId")),
                //companyId: Joi.string().regex(Regex.mongoObjectId).error(new Error("_id: Invalid CompanyId")),
                alertId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid AlertID")),
                message: Joi.string().required(),
                status: Joi.string().valid('IN','OUT','MISSING','SOLD').required(),
                readStatus: Joi.string().valid('VIEWED' , 'NOTVIEWED'),
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

    async updateAlert(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid id")),
                userId: Joi.string().regex(Regex.mongoObjectId).error(new Error("_id: Invalid UserId")),
                //companyId: Joi.string().regex(Regex.mongoObjectId).error(new Error("_id: Invalid CompanyId")),
                alertId: Joi.string().regex(Regex.mongoObjectId).error(new Error("_id: Invalid AlertId")),
                skuId: Joi.string().regex(Regex.mongoObjectId).error(new Error("_id: Invalid SkuId")),
                message: Joi.string(),
                status: Joi.string().valid('IN','OUT','MISSING','SOLD'),
                readStatus: Joi.string().valid('VIEWED' , 'NOTVIEWED'),
                isActive : Joi.boolean(),
                isDeleted : Joi.boolean(),
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

    async countBySkuCompanyId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            // count: Joi.array().items(Joi.object(indexCounter)).required(),   //Todo fix this array type via joi
            count: Joi.string().required(),
            filters: Joi.any(),  //Todo fix any
            // companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Required or Invalid ObjectId")),   //Todo fix regex issue
            companyId: Joi.string().error(new Error("companyId: Invalid ObjectId")),
        });
        await Schema.validateAsync(req.query, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }
}