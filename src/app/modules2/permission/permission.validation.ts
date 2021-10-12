import {Messages, Regex} from "../../constants";
import Joi, { string } from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import roleModel from "../role/role.model";


export  class PermissionValidation {

    async add(req: Request, res: Response, next: NextFunction): Promise<void> { //Todo rename all generic validation function to add and edit
        const roleData = await roleModel.findOne({shortDescription: 'SPACECODEADMIN', isDeleted: false, isActive: true}).select('_id').lean();
        await Joi.object({
            companyId: Joi.string().when('roleId', {
                is: `${roleData?._id}`,
                then: Joi.string().regex(Regex.mongoObjectId).error(new Error("Invalid companyId")),
                otherwise: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid companyId"))
            }),
            userId: Joi.string().regex(Regex.mongoObjectId).error(new Error("Invalid userId")),
            roleId: Joi.string().regex(Regex.mongoObjectId).error(new Error("Invalid roleId")),
            permission: Joi.array().items(Joi.object({
                screen: Joi.string().required(),
                access: Joi.array().items(Joi.object({
                    key: Joi.string().required(),
                    value: Joi.bool().required()
                }))
            })),
            loggedInUser: Joi.any(),
        }).validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)});
    }

    async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
        const roleData = await roleModel.findOne({shortDescription: 'SPACECODEADMIN', isDeleted: false, isActive: true}).select('_id').lean();
        await Joi.object({
            _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid _id")),
            companyId: Joi.string().when('roleId', {
                is: `${roleData?._id}`,
                then: Joi.string().regex(Regex.mongoObjectId).error(new Error("Invalid companyId")),
                otherwise: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("Invalid companyId"))
            }),
            userId: Joi.string().regex(Regex.mongoObjectId).error(new Error("Invalid companyId")),
            roleId: Joi.string().regex(Regex.mongoObjectId).error(new Error("Invalid companyId")),
            permission: Joi.array().items(Joi.object({
                screen: Joi.string().required(),
                access: Joi.array().items(Joi.object({
                    key: Joi.string().required(),
                    value: Joi.bool().required()
                }))
            })),
            loggedInUser: Joi.any(),
        }).validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async(err) => {res.locals.message = err.message;await JsonResponse.jsonError(req, res)})
    }
}