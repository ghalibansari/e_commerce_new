import Joi from "joi";
import { Errors } from "../../constants";
import { BaseValidation } from "../BaseValidation";
import { UserGenderEnum } from "../user/user.types";


export abstract class AuthValidation extends BaseValidation {
    static readonly login = Joi.object({
        email: Joi.string().email().max(50).required().error(new Error(Errors.EMAIL_ID)),
        password: this.JOI_PASSWORD_VALIDATION(),
    });

    static readonly changePassword = Joi.object({
        email: Joi.string().email().max(50).required().error(new Error(Errors.EMAIL_ID)),
        oldPassword: Joi.string().min(8).max(50).required().error(new Error(Errors.PASSWORD)),
        newPassword: this.JOI_PASSWORD_VALIDATION(Errors.NEW_PASSWORD),
    });

    static readonly register = Joi.object({
        first_name: Joi.string().min(3).max(20).required(),
        last_name: Joi.string().min(3).max(20).required(),
        gender: Joi.string().required().valid(...Object.values(UserGenderEnum)),
        email: Joi.string().email().required(),
        mobile: Joi.number().required(),
        password: this.JOI_PASSWORD_VALIDATION(),
    });

    static readonly forgotPassword = Joi.object({
        email: Joi.string().email().required()
    });

    static readonly resetPassword = Joi.object({
        email: Joi.string().email().required(),
        password: this.JOI_PASSWORD_VALIDATION(),
        otp: Joi.string().min(8).max(8).required()
    });

    static readonly emailVerification = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().min(8).max(8).required()
    });

};
