import { Messages, Regex } from "../../constants";
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { JsonResponse } from "../../helper";

export class DiamondMatchRuleValidation {

    async createDiamondMatchRule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let Schema = Joi.object({
                param: Joi.object({
                    premiumCycle: Joi.number().required(),
                    premiumPercent: Joi.number().required(),
                    regularCycle: Joi.number().required(),
                    randomPercent: Joi.number().required(),
                    threshold:Joi.number().required(),
                }).required(),
                companyId: Joi.string().required(),
                effectiveDate: Joi.date().required(),
                isActive: Joi.boolean(),
                isDeleted: Joi.boolean(),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, { abortEarly: false })
            next();
        }
        catch (err) {
            res.locals.data = { validation: false, isValid: false, validationError: err.message };
            res.locals.message = Messages.VALIDATION_ERROR;
            await JsonResponse.jsonError(req, res);
        }
    }

    async updateDiamondMatchRule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid ObjectId")),
                param: Joi.object({
                    premiumCycle: Joi.number().required(),
                    premiumPercent: Joi.number().required(),
                    regularCycle: Joi.number().required(),
                    randomPercent: Joi.number().required(),
                    threshold:Joi.number().required(),
                }),
                companyId: Joi.string(),
                effectiveDate: Joi.date().required(),
                isActive: Joi.boolean(),
                isDeleted: Joi.boolean(),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, { abortEarly: false })
            next();
        }
        catch (err) {
            res.locals.data = { validation: false, isValid: false, validationError: err.message };
            res.locals.message = Messages.VALIDATION_ERROR;
            await JsonResponse.jsonError(req, res);
        }
    }
}