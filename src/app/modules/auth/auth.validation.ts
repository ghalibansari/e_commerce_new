// import { Errors, Messages, Regex } from "../../constants";
import Joi from "joi";
// import { NextFunction, Request, Response } from "express";
// import { JsonResponse } from "../../helper";
import { BaseValidation } from "../BaseValidation";
import { Errors } from "../../constants";
import { maxHeaderSize } from "http";
import { UserGenderEnum } from "../user/user.types";


export abstract class AuthValidation extends BaseValidation {
    static readonly login = Joi.object({
        email: Joi.string().email().max(250).required().error(new Error(Errors.EMAIL_ID)),
        password: Joi.string().max(250).required().error(new Error(Errors.PASSWORD)),
    });

    static readonly changePassword = Joi.object({
        email: Joi.string().email().max(250).required().error(new Error(Errors.EMAIL_ID)),
        oldPassword: Joi.string().min(8).max(250).required().error(new Error(Errors.PASSWORD)),
        newPassword: Joi.string().min(8).max(250).required().error(new Error(Errors.PASSWORD))
    });

    static readonly register = Joi.object({
        first_name: Joi.string().min(3).max(100).required(),
        last_name: Joi.string().min(3).max(100).required(),
        gender: Joi.string().required().valid(...Object.values(UserGenderEnum)),
        email: Joi.string().email().required().error(new Error(Errors.INVALID_EMAIL_ID)),
        mobile: Joi.number().required(),
        password: Joi.string().min(8).max(100).required().error(new Error(Errors.PASSWORD)),
    })

};
