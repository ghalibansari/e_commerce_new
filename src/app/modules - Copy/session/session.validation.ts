// import {Messages, Regex} from "../../constants";
// import Joi from "joi";
// import {NextFunction, Request, Response} from "express";
// import {JsonResponse} from "../../helper";
//
//
// export  class SessionValidation {
//
//     async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 firstName: Joi.string().max(250).required(),
//                 lastName: Joi.string().max(250).required(),
//                 email: Joi.string().email().regex(Regex.emailRegex).required(),
//                 password: Joi.string().max(250).required().regex(Regex.passwordRegex).error(new Error(Errors.PASSWORD)),
//                 addressId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("addressId: Invalid ObjectId")),
//                 salt: Joi.string().required(),
//                 roleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("roleId: Invalid ObjectId")),
//                 companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
//                 attributes: Joi.any(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync(req.body, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals.data = {validation: false, isValid: false, validationError: err.message};
//             res.locals.message = Messages.VALIDATION_ERROR;
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async updateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
//                 firstName: Joi.string().max(250).required(),
//                 lastName: Joi.string().max(250).required(),
//                 email: Joi.string().email().regex(Regex.emailRegex).required(),
//                 password: Joi.string().max(250).required().regex(Regex.passwordRegex).error(new Error(Errors.PASSWORD)),
//                 addressId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("addressId: Invalid ObjectId")),
//                 salt: Joi.string().required(),
//                 roleId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("roleId: Invalid ObjectId")),
//                 companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
//                 attributes: Joi.any(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync(req.body, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals.data = {validation: false, isValid: false, validationError: err.message};
//             res.locals.message = Messages.VALIDATION_ERROR;
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
// }