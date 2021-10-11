import {Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";


const getGIAByReportNumberSchema = Joi.object({
    reportNumber: Joi.string().min(7).max(20).required(),
    loggedInUser: Joi.any(),
});

const getGIAByReportNumbersSchema = Joi.object({
    reportNumbers: Joi.array().items(Joi.number()).required(),//Joi.array().items(Joi.string().min(7).max(20).required()).required(), //Todo fix this Joi Array.
    companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid companyId")),
    loggedInUser: Joi.any(),
});


export  class GiaValidation {
    async getGIAByReportNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            await getGIAByReportNumberSchema.validateAsync(req.query, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }

    async getGIAByReportNumbers(req: Request, res: Response, next: NextFunction): Promise<void> {
        await getGIAByReportNumbersSchema.validateAsync(req.body, {abortEarly: false}).then(()=>next())
        .catch(async(err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res)})
    }

    // async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try{
    //         let Schema = Joi.object({
    //             _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
    //             firstName: Joi.string().max(250).required(),
    //             lastName: Joi.string().max(250).required(),
    //             email: Joi.string().email().regex(Regex.emailRegex).required(),
    //             altEmail: Joi.string().email().regex(Regex.emailRegex).required(),
    //             password: Joi.string().max(250).required().regex(Regex.passwordRegex).error(new Error(Errors.PASSWORD)),
    //             phone: Joi.number().integer().required(),
    //             address: Joi.any().required(),
    //             // salt: Joi.string().required(),
    //             roleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("roleId: Invalid ObjectId")),
    //             companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
    //             attributes: Joi.any(),
    //             loggedInUser: Joi.any(),
    //         });
    //         await Schema.validateAsync(req.body, {abortEarly: false})
    //         next();
    //     }
    //     catch(err){
    //         res.locals = {status: false, message: err.message}
    //         await JsonResponse.jsonSuccess(req, res);
    //     }
    // }
}