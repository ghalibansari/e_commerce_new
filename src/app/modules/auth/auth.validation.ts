// import { Errors, Messages, Regex } from "../../constants";
import Joi from "joi";
// import { NextFunction, Request, Response } from "express";
// import { JsonResponse } from "../../helper";
import { BaseValidation } from "../BaseValidation";
import { Errors } from "../../constants";


export abstract class AuthValidation extends BaseValidation {
    static readonly login = Joi.object({
        email: Joi.string().email().max(250).required().error(new Error(Errors.EMAIL_ID)),
        password: Joi.string().max(250).required().error(new Error(Errors.PASSWORD)),
    });
};