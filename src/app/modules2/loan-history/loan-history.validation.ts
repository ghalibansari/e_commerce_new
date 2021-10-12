import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {IUser} from "../user/user.types";
import {createAddressSchemaObject} from "../address/address.validation";
import {attributeJoiScheme} from "../attribute/attribute.validation";
import {ILoanHistory} from "./loan-history.types";

const createLoanSchemaObject = {
    companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
    amount: Joi.number().positive().required().error(new Error(Errors.AMOUNT_ERROR)),
    loggedInUser: Joi.any(),
};


export  class LoanValidationValidation {

    async createLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object<ILoanHistory>({...createLoanSchemaObject})
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async updateLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object<ILoanHistory>({
            _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
            ...createLoanSchemaObject})
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }
}
