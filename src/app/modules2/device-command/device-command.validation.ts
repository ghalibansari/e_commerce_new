import { Messages, Regex } from "../../constants";
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { JsonResponse } from "../../helper";

export class DeviceCommandValidation {

    async createDeviceCommand(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let Schema = Joi.object({
                command: Joi.string().required(),
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
                deviceId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("deviceId: Invalid ObjectId")),
                isActive: Joi.boolean(),
                isDeleted: Joi.boolean(),
                loggedInUser: Joi.any(),
            });
            await Schema.validateAsync(req.body, { abortEarly: false })
            next();
        }
        catch (err) {
            res.locals = { status: false, message: Messages.VALIDATION_ERROR, data: { validation: false, isValid: false, validationError: err.message } }
            await JsonResponse.jsonError(req, res);
        }
    }
}