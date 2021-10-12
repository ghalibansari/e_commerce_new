import {Messages, Regex} from "../../../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../../../helper";


export  class CaratMasterValidation {

    async createCaratMaster(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                caratMaster: Joi.array().items({
                    fromCarat: Joi.number().required(),
                    toCarat: Joi.number().required(),
                }).required(),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, {abortEarly: false})
            next();
        }
        catch(err){
            res.locals = {status: false, message: err.message}
            await JsonResponse.jsonError(req, res);
        }
    }
}