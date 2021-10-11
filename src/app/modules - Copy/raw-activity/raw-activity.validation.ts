import {Messages, Regex} from "../../constants";
import Joi, { string } from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


export  class RawActivityValidation {

    async createRawActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                inventory_id: Joi.number().required(),
                token: Joi.string().required(),
                action: Joi.string().valid("OPEN","CLOSE"),
                reader : Joi.object({
                    serial: Joi.string().required(),
                    drawer : Joi.number().required()
                }).required(),
                timestamp: Joi.any(),
                user: Joi.any(),
                //companyId: Joi.string().regex(Regex.mongoObjectId).error(new Error("_id: Invalid companyId")),
                events : Joi.array().items({
                    EventType: Joi.string().valid('IN','OUT','INVENTORY').required(),
                    stones: Joi.array().items(Joi.string()).required()
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

    async findDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid ObjectId")),
                pageNumber: Joi.number().min(1).max(999).error(new Error("Invalid Query pageNumber")),
                pageSize: Joi.number().error(new Error("Invalid Query pageSize")),
                filters: Joi.string().error(new Error("Invalid Query filters")),
                sort: Joi.string().error(new Error("Invalid Query sort")),
                count: Joi.string().error(new Error("Invalid Query count")),
                search: Joi.string().error(new Error("Invalid Query search")),
                column: Joi.string().error(new Error("Invalid Query column")),//array().items(Joi.string().required()),               
                loggedInUser: Joi.any().error(new Error("Invalid Query pageNumber")),
            });
            await Schema.validateAsync(req.query, {abortEarly: false})
            next()
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }
}