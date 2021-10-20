import { Errors, Messages, Regex } from "../../constants";
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { JsonResponse } from "../../helper";
import { IUnit } from "./unit.types";
import { BaseValidation } from "../BaseValidation";


export abstract class UnitValidation extends BaseValidation {
    static readonly addUnit = Joi.object<IUnit>({
        name: Joi.string().min(3).max(100).required(),
        short_name: Joi.string().min(1).max(5).required(),
        description: Joi.string().min(3).max(100).required(),
        status: Joi.boolean().required(),
        created_by: Joi.any(),
        updated_by: Joi.any()
    });

    static readonly addUnitBulk = Joi.array().items(this.addUnit)

    static readonly editUnit = Joi.object<IUnit>({
        name: Joi.string().min(3).max(100),
        short_name: Joi.string().min(1).max(5).required(),
        description: Joi.string().min(3).max(100),
        status: Joi.boolean(),
        created_by: Joi.any(),
        updated_by: Joi.any()
    });
};