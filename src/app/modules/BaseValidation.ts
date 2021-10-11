import Joi from "joi";
import {Request, Response} from "express";
import {Messages, Regex} from "../constants";
import {JsonResponse} from "../helper";


export const indexCounter = {
    key: Joi.string(),
    value: Joi.string(),
};


export class BaseValidation {

    async findBC(req: Request, res: Response): Promise<void> {
        const Schema = Joi.object({
            where: Joi.object(),//.error(new Error("Invalid Query column")),//array().items(Joi.string().required()),
            pageNumber: Joi.number().min(1).max(9999).error(new Error("Invalid Query pageNumber")),
            pageSize: Joi.number().min(1).max(1000).error(new Error("Invalid Query pageSize")),
            rangeFilters:Joi.string().error(new Error("Invalid Query rangeFilters")),
            sort: Joi.string().error(new Error("Invalid Query sort")),
            count: Joi.string().error(new Error("Invalid Query count")),
            search: Joi.string().max(55).error(new Error("Invalid Query search")),
            loggedInUser: Joi.any().error(new Error("Invalid Query pageNumber")),
        });
        //@ts-expect-error
        if(req.query.where) req.query.where = JSON.parse(req.query.where)
        await Schema.validateAsync(req.query, {abortEarly: false})
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonSuccess(req, res)})
    }

    async groupByBC(req: Request, res: Response): Promise<void> {
        const Schema = Joi.object({
            key: Joi.string().max(50).error(new Error("Invalid Key, key Should be string")),
            loggedInUser: Joi.any().error(new Error("Invalid Query pageNumber")),
        });
        await Schema.validateAsync(req.query, {abortEarly: false})
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonSuccess(req, res)})
    }
}