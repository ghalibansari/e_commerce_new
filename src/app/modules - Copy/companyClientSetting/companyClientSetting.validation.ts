import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {createAddressSchemaObject, updateAddressSchemaObject} from "../address/address.validation";
import {attributeJoiScheme} from "../attribute/attribute.validation";
import {IUser} from "../user/user.types";
import {ICompanyClientSetting} from "./companyClientSetting.types";



export const companyClientSettingSchemaObject = {
    _id: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ID)),
    companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
    diamondMatchRegistration: Joi.bool().required(),
    ltv: Joi.number().min(0).max(100),
    loggedInUser: Joi.any(),
}


export  class CompanyClientSettingValidation {
    async updateDiamondMatchSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object<ICompanyClientSetting>(companyClientSettingSchemaObject)
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async bulkUpdateDiamondMatchSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            newData: Joi.array().items(Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_ID)),
                companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
                diamondMatchRegistration: Joi.bool().required(),
                isOpenBusiness: Joi.string().required(),
                ltv: Joi.number().min(0).max(100)
            })),
            loggedInUser: Joi.any(),
        })
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }
}
