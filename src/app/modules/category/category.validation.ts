import { Errors, Messages, Regex } from "../../constants";
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { JsonResponse } from "../../helper";
import { ICategory } from "./category.types";
import { BaseValidation } from "../BaseValidation";


export abstract class CategoryValidation extends BaseValidation {
    static readonly addCategory = Joi.object<ICategory>({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(3).max(100).required(),
        status: Joi.boolean().required(),
        created_by: Joi.any(),
        updated_by: Joi.any()
    });

    static readonly addCategoryBulk = Joi.array().items(this.addCategory)

    static readonly editCategory = Joi.object<ICategory>({
        name: Joi.string().min(3).max(100),
        description: Joi.string().min(3).max(100),
        status: Joi.boolean(),
        created_by: Joi.any(),
        updated_by: Joi.any()
    });
};