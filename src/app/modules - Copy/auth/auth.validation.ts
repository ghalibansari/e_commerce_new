import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


export  class AuthValidation {

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bodySchemaLogin = Joi.object({
            email: Joi.string().email().max(250).required().error(new Error(Errors.EMAIL_ID)),
            password: Joi.string().max(250).required(),
        });
        await bodySchemaLogin.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async loginVerify(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bodySchemaLogin = Joi.object({
            email: Joi.string().email().max(250).required().error(new Error(Errors.EMAIL_ID)),
            password: Joi.string().max(250).required().regex(Regex.passwordRegex).error(new Error(Errors.PASSWORD)),
            otp: Joi.string().required().error(new Error(Errors.OTP)),
        });
        await bodySchemaLogin.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bodySchemaLogin = Joi.object({
            email: Joi.string().email().max(250).regex(Regex.emailRegex).required(),
            oldpassword: Joi.string().max(250).required().regex(Regex.emailRegex).error(new Error(Errors.OLD_PASSWORD)),
            newpassword: Joi.string().max(250).required().regex(Regex.emailRegex).error(new Error(Errors.NEW_PASSWORD)),
        });
        await bodySchemaLogin.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async changePasswordVerify(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bodySchemaLogin = Joi.object({
            email: Joi.string().email().max(250).regex(Regex.emailRegex).required(),
            oldpassword: Joi.string().max(250).required().regex(Regex.emailRegex).error(new Error(Errors.OLD_PASSWORD)),
            newpassword: Joi.string().max(250).required().regex(Regex.emailRegex).error(new Error(Errors.NEW_PASSWORD)),
            otp: Joi.string().min(6).max(6).required(),
        });
        await bodySchemaLogin.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bodySchemaLogin = Joi.object({ email: Joi.string().email().max(250).regex(Regex.emailRegex).required(), });
        await bodySchemaLogin.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async forgetPasswordVerify(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bodySchemaLogin = Joi.object({
            email: Joi.string().email().max(250).regex(Regex.emailRegex).required(),
            password: Joi.string().max(250).required().regex(Regex.passwordRegex).error(new Error(Errors.PASSWORD)),
            otp: Joi.string().min(6).max(6).required(),
        });
        await bodySchemaLogin.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }
}