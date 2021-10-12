import {Errors, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {createCommentSchemaObject} from "../comment/comment.validation";
import {skuDmStatusEnum, skuStoneStatusEnum} from "./sku.types";


export  class SkuValidation {
    async createSku(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            infinityRefId: Joi.string().max(50).required().error(new Error(`infinityRefId, ${Errors.INVALID_OR_REQUIRED}`)),
            dmGuid: Joi.string().max(250).required().error(new Error(`dmGuid, ${Errors.INVALID_OR_REQUIRED}`)),
            infinityShape: Joi.string().max(250).required().error(new Error(`infinityShape, ${Errors.INVALID_OR_REQUIRED}`)),
            clientShape: Joi.string().max(250).required().error(new Error(`clientShape, ${Errors.INVALID_OR_REQUIRED}`)),
            labShape: Joi.string().max(250).required().error(new Error(`labShape, ${Errors.INVALID_OR_REQUIRED}`)),
            shape: Joi.string().max(250).required().error(new Error(`shape, ${Errors.INVALID_OR_REQUIRED}`)),
            labsId: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_LAB_ID))),
            weight: Joi.string().max(250).required().error(new Error(`weight, ${Errors.INVALID_OR_REQUIRED}`)),
            colorCategory: Joi.string().max(250).required().error(new Error(`colorCategory, ${Errors.INVALID_OR_REQUIRED}`)),
            colorSubCategory: Joi.string().max(250).required().error(new Error(`colorSubCategory, ${Errors.INVALID_OR_REQUIRED}`)),
            gradeReportColor: Joi.string().max(250).required().error(new Error(`gradeReportColor, ${Errors.INVALID_OR_REQUIRED}`)),
            colorRapnet: Joi.string().max(250).required().error(new Error(`colorRapnet, ${Errors.INVALID_OR_REQUIRED}`)),
            clarity: Joi.string().max(250).required().error(new Error(`clarity, ${Errors.INVALID_OR_REQUIRED}`)),
            cut: Joi.string().max(250).required().error(new Error(`cut, ${Errors.INVALID_OR_REQUIRED}`)),
            measurement: Joi.string().max(250).required().error(new Error(`measurement, ${Errors.INVALID_OR_REQUIRED}`)),
            colorType: Joi.string().max(250).required().error(new Error(`colorType, ${Errors.INVALID_OR_REQUIRED}`)),
            comments: Joi.array().items(createCommentSchemaObject).required().error(new Error(`comments, ${Errors.INVALID_OR_REQUIRED}`)),
            companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
            rfid: Joi.string().max(250).required().error(new Error(`rfid, ${Errors.INVALID_OR_REQUIRED}`)),
            polish: Joi.string().max(250).required().error(new Error(`polish, ${Errors.INVALID_OR_REQUIRED}`)),
            tagId: Joi.string().max(50).required().error(new Error(`tagId, ${Errors.INVALID_OR_REQUIRED}`)),
            symmetry: Joi.string().max(250).required().error(new Error(`symmetry, ${Errors.INVALID_OR_REQUIRED}`)),
            fluorescence: Joi.string().max(250).required().error(new Error(`fluorescence, ${Errors.INVALID_OR_REQUIRED}`)),
            loggedInUser: Joi.any(),
        })
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async updateSku(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
            infinityRefId: Joi.string().max(50).required(),
            dmGuid: Joi.string().max(250).required(),
            infinityShape: Joi.string().max(250).required(),
            clientShape: Joi.string().max(250).required(),
            labShape: Joi.string().max(250).required(),
            shape: Joi.string().max(250).required(),
            labsId: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_LAB_ID))).required(),
            weight: Joi.number().required(),
            colorCategory: Joi.string().max(250).required(),
            colorSubCategory: Joi.string().max(250).required(),
            gradeReportColor: Joi.string().max(250).required(),
            colorRapnet: Joi.string().max(250).required(),
            clarity: Joi.string().max(250).required(),
            cut: Joi.string().max(250).required(),
            measurement: Joi.string().max(250).required(),
            colorType: Joi.string().max(250).required(),
            comments: Joi.array().items(createCommentSchemaObject).required(),
            companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
            rfid: Joi.string().max(250).required(),
            polish: Joi.string().max(250).required(),
            tagId: Joi.string().max(50).required(),
            movementStatus: Joi.string(),
            status: Joi.string(),
            symmetry: Joi.string().max(250).required(),
            fluorescence: Joi.string().max(250).required(),
            loggedInUser: Joi.any(),
        })
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async importSku(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skus: Joi.any().required(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async changeDmStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        Joi.object({
            newData: Joi.array().items(Joi.object({
                _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
                dmGuid: Joi.string().max(250).required(),
            })).required(),
            loggedInUser: Joi.any(),
        })
        .validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async moveToCollateralSku(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skuIds: Joi.array().required(),
            transactionId: Joi.string(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async skuStatusValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skuIds: Joi.array().required(),
            transactionId: Joi.string(),
            status: Joi.string().required(),
            stoneRegistration: Joi.boolean(),
            comments: Joi.string(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async MultipleDeleteVerifyValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            // skuIds: Joi.array().items(Joi.string()).required(),
            skuIds: Joi.string().required(),
            otp: Joi.string().length(6).required(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync({...req.body,...req.query}, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async MultipleDeleteValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skuIds: Joi.array().items(Joi.string()).required(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync({...req.body, ...req.query}, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async skuImportValidation(data: any): Promise<false|string> {
        const Schema = Joi.object({
            companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_COMPANY_ID)),
            tag: Joi.number().required().error(new Error(`tag ${Errors.IS_REQUIRED}`)),
            ref: Joi.string().required().error(new Error(`ref ${Errors.IS_REQUIRED}`)),
            assetId: Joi.string().allow(null).error(new Error(`assetId ${Errors.IS_REQUIRED}`)),
            stoneType: Joi.string().required().error(new Error(`stoneType ${Errors.IS_REQUIRED}`)),
            shape: Joi.string().required().error(new Error(`shape ${Errors.IS_REQUIRED}`)),
            color: Joi.string().required().error(new Error(`color ${Errors.IS_REQUIRED}`)),
            caratWeight: Joi.number().required().error(new Error(`caratWeight ${Errors.IS_REQUIRED}`)),
            clarity: Joi.string().required().error(new Error(`clarity ${Errors.IS_REQUIRED}`)),
            source: Joi.string().required().error(new Error(`source ${Errors.IS_REQUIRED}`)),
            lab: Joi.string().required().error(new Error(`lab ${Errors.IS_REQUIRED}`)),
            gia: Joi.string().error(new Error(`gia ${Errors.IS_REQUIRED}`)),
            reportDate: Joi.any(),
            gradingReportShape: Joi.string().allow(null).required().error(new Error(`gradingReportShape ${Errors.IS_REQUIRED}`)),
            gradingReportColor: Joi.string().allow(null).required().error(new Error(`gradingReportColor ${Errors.IS_REQUIRED}`)),
            measurements: Joi.any().error(new Error(`measurements ${Errors.IS_REQUIRED}`)),
            ms1: Joi.allow(null),
            ms2: Joi.allow(null),
            ms3: Joi.allow(null),
            refField: Joi.string().required().error(new Error(`refField ${Errors.IS_REQUIRED}`)),
            reportNumber: Joi.number().required().error(new Error(`reportNumber ${Errors.IS_REQUIRED}`)),
            pdf: Joi.string().allow(null).error(new Error(`pdf ${Errors.IS_REQUIRED}`)),
            fixedValueCarat: Joi.number().required().error(new Error(`fixedValueCarat ${Errors.IS_REQUIRED}`)),
            totalUsd: Joi.string().error(new Error(`totalUsd ${Errors.IS_REQUIRED}`)),
            tagId:Joi.string().allow(null).error(new Error(`tagId ${Errors.IS_REQUIRED}`)),
            priceId: Joi.any().error(new Error(`priceId ${Errors.IS_REQUIRED}`)),
            pwv: Joi.string().required().error(new Error(`pwv ${Errors.IS_REQUIRED}`)),
            drv: Joi.string().required().error(new Error(`drv ${Errors.IS_REQUIRED}`)),
            iav: Joi.string().required().error(new Error(`iav ${Errors.IS_REQUIRED}`)),
            iavAverage: Joi.number().required().error(new Error(`iavAverage ${Errors.IS_REQUIRED}`)),
            pwvImport: Joi.string().required().error(new Error(`pwvImport ${Errors.IS_REQUIRED}`)),
            rapPriceId: Joi.any().error(new Error(`rapPriceId ${Errors.IS_REQUIRED}`)),
            rap: Joi.string().error(new Error(`rap ${Errors.IS_REQUIRED}`)),
            price: Joi.string().disallow("NaN").error(new Error(`price ${Errors.IS_REQUIRED}`)),
            difference: Joi.string().required().error(new Error(`difference ${Errors.IS_REQUIRED}`)),
            importStatus:Joi.any().error(new Error(`importStatus ${Errors.IS_REQUIRED}`)),
            loggedInUser: Joi.any()
        });
        return await Schema.validateAsync(data, {abortEarly: false}).then(()=> false).catch(err => err.message)
    }

    async updateCollateralValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skuIds: Joi.array().items(Joi.string()),
            isCollateral: Joi.boolean().required(),
            stoneRegistration: Joi.boolean(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async ledTrigger(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skuIds: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).required().error(new Error("skuId: Invalid ObjectId"))),
            status: Joi.string().required().error(new Error(`status ${Errors.IS_REQUIRED}`)),
            comments: Joi.string().allow(null, "").error(new Error(`comments ${Errors.IS_REQUIRED}`)),
            lifeTime: Joi.date().allow(null),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res)})
    }

    async getSkuByTag(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({tagNo: Joi.string().required(), filters: Joi.string() })
        await Schema.validateAsync(req.query, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res)})
    }

    async getSkuFromTime(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({ date: Joi.string() });
        await Schema.validateAsync(req.query, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res)})
    }

    async skuLabUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skuId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_SKU_ID)),
            labId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_LAB_ID)),
            labReportId: Joi.number().required(),
            labReportPath: Joi.string().required(),
            labReportDate: Joi.string().required(),
            rfid: Joi.number().integer().positive().required(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async c4Edit(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            _id: Joi.string().regex(Regex.mongoObjectId).required().error(new Error(Errors.INVALID_ID)),
            labReportId: Joi.number().required().error(new Error(`labReportId ${Errors.IS_REQUIRED}`)),
            labReportDate: Joi.date().allow(null).error(new Error(`labReportDate ${Errors.IS_REQUIRED}`)),
            labShape: Joi.string().error(new Error(`labShape ${Errors.IS_REQUIRED}`)),
            weight: Joi.number().error(new Error(`weight ${Errors.IS_REQUIRED}`)),
            colorCategory: Joi.string().error(new Error(`colorCategory ${Errors.IS_REQUIRED}`)),
            colorType: Joi.string().error(new Error(`colorType ${Errors.IS_REQUIRED}`)),
            clarity: Joi.string().error(new Error(`clarity ${Errors.IS_REQUIRED}`)),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async removeCollateral(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            tags: Joi.array().items(Joi.string()).required(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async countByCompanyId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            // count: Joi.array().items(Joi.object(indexCounter)).required(),   //Todo fix this array type via joi
            count: Joi.string().required(),
            filters: Joi.any(),  //Todo fix any
            // companyId: Joi.string().regex(Regex.mongoObjectId).required().error(new Error("companyId: Required or Invalid ObjectId")),   //Todo fix regex issue
            companyId: Joi.string().error(new Error("companyId: Invalid ObjectId")),
        });
        await Schema.validateAsync(req.query, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async senEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            data: Joi.array().items(Joi.object({
                refId: Joi.number().required(),
                message: Joi.string().required(),
                importStatus: Joi.string().required()
            })).required(),
            loggedInUser: Joi.any()
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async importDrop(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            password: Joi.string().required(),
            companyId: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_COMPANY_ID)),
            loggedInUser: Joi.any()
        });
        await Schema.validateAsync(req.query, {abortEarly: false}).then(() => next())
            .catch(async (err) => {res.locals.message = err.message; await JsonResponse.jsonError(req, res)})
    }

    async updateStoneStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skuData: Joi.array().items({
                skuId: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_SKU_ID)).required(),
                status: Joi.string().valid("PENDING REVIEW", "ARRIVAL","TRANSIT","CONSIGNMENT","APPROVED","REJECTED","MISSING","SOLD","REMOVED","PRICE CHANGED").required(),
                stoneRegistration: Joi.boolean()
            }).required(),
            loggedInUser: Joi.any()
        });
        await Schema.validateAsync(req.body, { abortEarly: false }).then(() => next())
    .catch(async (err) => { res.locals.message = err.message; await JsonResponse.jsonError(req, res) })
    }

    changeInfinityPrice = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        await Joi.object({
            newData: Joi.array().items({
                skuId: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_SKU_ID)).required(),
                price: Joi.number().required()
            }).required(),
            loggedInUser: Joi.any()
        })
        .validateAsync(req.body, { abortEarly: false }).then(() => next())
        .catch(async (err) => { res.locals.message = err.message; await JsonResponse.jsonError(req, res) })
    }

    async updateDmStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skuIds: Joi.array().required(),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }

    async updateGemlogistStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        const Schema = Joi.object({
            skuId: Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_SKU_ID)),
            skuIds: Joi.array().items(Joi.string().regex(Regex.mongoObjectId).error(new Error(Errors.INVALID_SKU_ID)).required()),
            transactionId: Joi.string(),
            status: Joi.string().required(),
            comments: Joi.array().items(createCommentSchemaObject),
            loggedInUser: Joi.any(),
        });
        await Schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
        .catch(async (err) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonError(req, res);})
    }
}
