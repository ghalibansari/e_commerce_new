import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


const createTransitSchema = Joi.object({
    skuId: Joi.any().required(),
    comments: Joi.any().required(),
    time: Joi.date().required(),
    to: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_TO)),
    from: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_FROM)),
    statusId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_STATUS_ID)),
    loggedInUser: Joi.any(),
});

const updateTransitSchema = Joi.object({
    _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
    skuId: Joi.any().required(),
    comments: Joi.any().required(),
    time: Joi.date().required(),
    to: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_TO)),
    from: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_FROM)),
    statusId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_STATUS_ID)),
    loggedInUser: Joi.any(),
});


export class TransitValidation {
    async createTransit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                skuIds: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).required().error(new Error("skuIds: Invalid ObjectId"))).required(),
                comments: Joi.array().items({
                    comment: Joi.string().required()
                }),
                transitTime: Joi.date().required(),
                returnTime: Joi.any(),
                companyId:Joi.string().required(),
                status: Joi.string().valid('INPROGRESS','DELIVERED','INITIATED').required(),
                isSchedule: Joi.boolean(),
                schedule: Joi.object(),
                // time: Joi.date().required(),
                // to: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("to: Invalid ObjectId")),
                // from: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("from: Invalid ObjectId")),
                // statusId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("statusId: Invalid ObjectId")),
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

    async updateTransit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                skuIds: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).required().error(new Error("skuIds: Invalid ObjectId"))).required(),
                comments: Joi.array().items({
                    comment: Joi.string().required()
                }),
                companyId:Joi.string().required(),
                transitTime: Joi.date().required(),
                returnTime: Joi.any(),
                status: Joi.string().valid('INPROGRESS','DELIVERED','INITIATED').required(),
                // time: Joi.date().required(),
                // to: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("to: Invalid ObjectId")),
                // from: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("from: Invalid ObjectId")),
                // statusId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("statusId: Invalid ObjectId")),
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
                transitId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("transitId: Invalid ObjectId")),
                loggedInUser: Joi.any(),
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

