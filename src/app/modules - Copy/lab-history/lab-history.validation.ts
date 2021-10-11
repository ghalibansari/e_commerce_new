// import {Messages, Regex} from "../../constants";
// import Joi from "joi";
// import {NextFunction, Request, Response} from "express";
// import {JsonResponse} from "../../helper";
//
//
// export  class SkuHistoryValidation {
//
//     async createSku(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 infinityRefId: Joi.string().max(50).required(),
//                 dmGuid: Joi.string().max(250).required(),
//                 infinityShape: Joi.string().max(250).required(),
//                 clientShape: Joi.string().max(250).required(),
//                 labShape: Joi.string().max(250).required(),
//                 shape: Joi.string().max(250).required(),
//                 labsId: Joi.any().required(),
//                 weight: Joi.string().max(250).required(),
//                 colorCategory: Joi.string().max(250).required(),
//                 colorSubCategory: Joi.string().max(250).required(),
//                 gradeReportColor: Joi.string().max(250).required(),
//                 colorRapnet: Joi.string().max(250).required(),
//                // clarity: Joi.string().max(250).required(),
//                 cut: Joi.string().max(250).required(),
//                 measurement: Joi.string().max(250).required(),
//                 colorType: Joi.string().max(250).required(),
//                 comments: Joi.any().required(),
//                 companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("addressId: Invalid ObjectId")),
//                 rfid: Joi.string().max(250).required(),
//                 polish: Joi.string().max(250).required(),
//                 tagId: Joi.string().max(50).required(),
//                 symmetry: Joi.string().max(250).required(),
//                 fluorescence: Joi.string().max(250).required(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync(req.body, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async updateSku(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("_id: Invalid ObjectId")),
//                 infinityRefId: Joi.string().max(50).required(),
//                 dmGuid: Joi.string().max(250).required(),
//                 infinityShape: Joi.string().max(250).required(),
//                 clientShape: Joi.string().max(250).required(),
//                 labShape: Joi.string().max(250).required(),
//                 shape: Joi.string().max(250).required(),
//                 labsId: Joi.any().required(),
//                 weight: Joi.number().required(),
//                 colorCategory: Joi.string().max(250).required(),
//                 colorSubCategory: Joi.string().max(250).required(),
//                 gradeReportColor: Joi.string().max(250).required(),
//                 colorRapnet: Joi.string().max(250).required(),
//                 clarity: Joi.string().max(250).required(),
//                 cut: Joi.string().max(250).required(),
//                 measurement: Joi.string().max(250).required(),
//                 colorType: Joi.string().max(250).required(),
//                 comments: Joi.any().required(),
//                 companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("addressId: Invalid ObjectId")),
//                 rfid: Joi.string().max(250).required(),
//                 polish: Joi.string().max(250).required(),
//                 tagId: Joi.string().max(50).required(),
//                 movementStatus: Joi.string(),
//                 status: Joi.string(),
//                 symmetry: Joi.string().max(250).required(),
//                 fluorescence: Joi.string().max(250).required(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync(req.body, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async importSku(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 skus: Joi.any().required(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync(req.body, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async moveToCollateralSku(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 skuIds: Joi.array().required(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync(req.body, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async skuStatusValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 skuIds: Joi.array().required(),
//                 status: Joi.string().required(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync(req.body, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async MultipleDeleteVerifyValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 // skuIds: Joi.array().items(Joi.string()).required(),
//                 skuIds: Joi.string().required(),
//                 otp: Joi.string().length(6).required(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync({...req.body,...req.query}, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async MultipleDeleteValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 skuIds: Joi.array().items(Joi.string()).required(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync({...req.body, ...req.query}, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async skuImpoValidation( data: any): Promise<void> {
//         try{
//             let Schema =
//                 Joi.object({
//                     companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Invalid ObjectId")),
//                     //company: Joi.string().required(),
//                     tag: Joi.number().required(),
//                     ref: Joi.string().required(),
//                     assetId: Joi.string().allow(null),
//                     stoneType: Joi.string().required(),
//                     shape: Joi.string().required(),
//                     color: Joi.string().required(),
//                     caratWeight: Joi.any().required(),
//                     clarity: Joi.string().required(),
//                     source: Joi.string().required(),
//                     lab: Joi.string().required(),
//                     gia: Joi.any(),
//                     reportDate: Joi.string().required(),
//                     gradingReportShape: Joi.string().allow(null).required(),
//                     gradingReportColor: Joi.string().allow(null).required(),
//                     measurements: Joi.string().required(),
//                     ms1: Joi.any(),
//                     ms2: Joi.any(),
//                     ms3: Joi.any(),
//                     refField: Joi.string().required(),
//                     reportNumber: Joi.any().required(),
//                     pdf: Joi.string().allow(null).required(),
//                     fixedValueCarat: Joi.any().required(),
//                     totalUsd: Joi.string(),
//                     tagId:Joi.any(),
//                     priceId: Joi.any(),
//                     pwv: Joi.string().required(),
//                     drv: Joi.string().required(),
//                     iav: Joi.string().required(),
//                     iavAverage: Joi.number().required(),
//                     pwvImport: Joi.string().required(),
//                     rapPriceId: Joi.any(),
//                     rap: Joi.string(),
//                     price: Joi.string().disallow("NaN"),
//                     difference: Joi.string().required(),
//                     loggedInUser: Joi.any(),
//                     importStatus:Joi.any()
//             });
//             await Schema.validateAsync(data, {abortEarly: false})
//             return
//         }
//         catch(err){
//             // res.locals = {status: false, message: err.message}
//             // await JsonResponse.jsonSuccess(req, res);
//             return err.message
//         }
//     }
//
//     async updateCollateralValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 skuIds: Joi.array().items(Joi.string()),
//                 isCollateral: Joi.boolean().required(),
//                 dmCheck: Joi.boolean(),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync(req.body, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async ledTrigger(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 skuIds: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).required().error(new Error("skuId: Invalid ObjectId"))),
//                 status: Joi.string().required(),
//                 comments: Joi.string().allow(null,""),
//                 loggedInUser: Joi.any(),
//             });
//             await Schema.validateAsync(req.body, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async getSkuByTag(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 // tagNo: Joi.array().items(Joi.string()).required()
//                 tagNo: Joi.string().required()
//             });
//             await Schema.validateAsync(req.query, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
//
//     async getSkuFromTime(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try{
//             let Schema = Joi.object({
//                 date: Joi.string()
//             });
//             await Schema.validateAsync(req.query, {abortEarly: false})
//             next();
//         }
//         catch(err){
//             res.locals = {status: false, message: err.message}
//             await JsonResponse.jsonSuccess(req, res);
//         }
//     }
// }