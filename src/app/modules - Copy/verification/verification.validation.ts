import {Messages} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";

export class VerificationValidation {
    async sendOtpValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                operation: Joi.string().required(),
                module: Joi.string().required(),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, {abortEarly: false})
            next();
        }
        catch(err){
            //@ts-expect-error
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }

}