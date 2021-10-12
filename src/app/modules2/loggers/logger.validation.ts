import {Messages, modulesEnum, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {ILogger, loggerLevelEnum} from "./logger.types";


export  class LoggerValidation {

    async createLogger(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object<ILogger>({
                url: Joi.string().max(250).required(),
                method: Joi.string().max(250).required(),
                query: Joi.string().max(250).required(),
                body: Joi.string().max(250).required(),
                // module: Joi.string().valid(...Object.keys(modulesEnum)).max(250),    //Todo uncomment this line
                module: Joi.string().max(250),
                message: Joi.string().max(250).required(),
                level: Joi.string().allow(loggerLevelEnum.frontend).max(250).required(),
                //@ts-expect-error
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

    async updateLogger(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            let Schema = Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
                lab: Joi.string().max(250).required(),
                labReportId: Joi.string().max(250).required(),
                labReportDate: Joi.string(),
                labReportPath: Joi.string().max(250).required(),
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