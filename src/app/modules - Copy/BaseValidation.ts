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
            column: Joi.string().error(new Error("Invalid Query column")),//array().items(Joi.string().required()),
            pageNumber: Joi.number().min(1).max(999).error(new Error("Invalid Query pageNumber")),
            pageSize: Joi.number().error(new Error("Invalid Query pageSize")),
            filters: Joi.string().error(new Error("Invalid Query filters")),
            filtersIn:Joi.string().error(new Error("Invalid Query filtersIn")),
            rangeFilters:Joi.string().error(new Error("Invalid Query rangeFilters")),
            sort: Joi.string().error(new Error("Invalid Query sort")),
            count: Joi.string().error(new Error("Invalid Query count")),
            search: Joi.string().error(new Error("Invalid Query search")),
            sliders: Joi.object({
                weight: Joi.array().length(2), //Todo fix validation here weight: Joi.array().items(Joi.number().required()).length(2)
                drv: Joi.array().length(2),
                iav: Joi.array().length(2),
                pwv: Joi.array().length(2),
                vc: Joi.array().length(2),
            }),
            loggedInUser: Joi.any().error(new Error("Invalid Query pageNumber")),
        });
        //@ts-expect-error
        if(req.query.sliders) req.query.sliders = await JSON.parse(req.query.sliders);
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