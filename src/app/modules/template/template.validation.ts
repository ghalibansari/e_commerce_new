// import Joi from "joi";
// import { Request, Response, NextFunction } from "express";
// import { Errors, Messages, Regex } from "../../constants"
// import { JsonResponse } from "../../helper"


// const createTemplateSchema = Joi.object({
//     title: Joi.string().max(250).required(),
//     slug: Joi.string().max(250).required(),
//     subject: Joi.string().max(250).allow(null),
//     body: Joi.string().allow(null),
//     params: Joi.string().allow(null),
//     type: Joi.number().required(),
//     loggedInUser: Joi.any()
// });

// const updateTemplateSchema = Joi.object({
//     _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
//     title: Joi.string().max(250).required(),
//     slug: Joi.string().max(250).required(),
//     subject: Joi.string().max(250).allow(null),
//     body: Joi.string().allow(null),
//     params: Joi.string().allow(null),
//     type: Joi.number().required(),
//     loggedInUser: Joi.any()
// });


// export class TemplateValidation {
//     async createTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try {
//             await createTemplateSchema.validateAsync(req.body, { abortEarly: false })
//             next();
//         }
//         catch (err) {
//             res.locals = { status: false, message: err.message }
//             await JsonResponse.jsonError(req, res);
//         }
//     }

//     async updateTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try {
//             await updateTemplateSchema.validateAsync(req.body, { abortEarly: false })
//             next();
//         }
//         catch (err) {
//             res.locals = { status: false, message: err.message }
//             await JsonResponse.jsonError(req, res);
//         }
//     }
// }