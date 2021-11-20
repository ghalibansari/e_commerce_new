// import { Errors, Messages, Regex } from "../../constants";
import Joi from "joi";
import { Errors } from "../../constants";
// import { NextFunction, Request, Response } from "express";
// import { JsonResponse } from "../../helper";
import { BaseValidation } from "../BaseValidation";
import { UserGenderEnum } from "../user/user.types";


export abstract class AuthValidation extends BaseValidation {
    static readonly login = Joi.object({
        email: Joi.string().email().max(50).required().error(new Error(Errors.EMAIL_ID)),
        password: Joi.string().max(50).required().error(new Error(Errors.PASSWORD)),
    });

    static readonly changePassword = Joi.object({
        email: Joi.string().email().max(50).required().error(new Error(Errors.EMAIL_ID)),
        oldPassword: Joi.string().min(8).max(50).required().error(new Error(Errors.PASSWORD)),
        newPassword: Joi.string().min(8).max(50).required().error(new Error(Errors.PASSWORD))
    });

    static readonly register = Joi.object({
        first_name: Joi.string().min(3).max(20).required(),
        last_name: Joi.string().min(3).max(20).required(),
        gender: Joi.string().required().valid(...Object.values(UserGenderEnum)),
        email: Joi.string().email().required().error(new Error(Errors.INVALID_EMAIL_ID)),
        mobile: Joi.number().required(),
        password: Joi.string().min(8).max(40).required().error(new Error(Errors.PASSWORD)),
    });

    static readonly forgotPassword = Joi.object({
        email: Joi.string().email().required().error(new Error(Errors.INVALID_EMAIL_ID))
    });

    static readonly resetPassword = Joi.object({
        email: Joi.string().email().required().error(new Error(Errors.INVALID_EMAIL_ID)),
        password: Joi.string().min(8).max(50).required(),
        otp: Joi.string().min(8).max(8).required()
    });

    static readonly emailVerification = Joi.object({
        email: Joi.string().email().required().error(new Error(Errors.INVALID_EMAIL_ID)),
        otp: Joi.string().min(8).max(8).required()
    });

};
