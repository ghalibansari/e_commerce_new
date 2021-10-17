import { Errors, Messages, Regex } from "../../constants";
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { JsonResponse } from "../../helper";
import { IBrand } from "./brand.types";
import { BaseValidation } from "../BaseValidation";


export abstract class BrandValidation extends BaseValidation {
    static readonly addBrand = Joi.object<IBrand>({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(3).max(100).required(),
        status: Joi.boolean().required(),
        created_by: Joi.any(),
        updated_by: Joi.any()
    });

    static readonly addBrandBulk = Joi.array().items(this.addBrand)

    static readonly editBrand = Joi.object<IBrand>({
        name: Joi.string().min(3).max(100),
        description: Joi.string().min(3).max(100),
        status: Joi.boolean(),
        created_by: Joi.any(),
        updated_by: Joi.any()
    });
};