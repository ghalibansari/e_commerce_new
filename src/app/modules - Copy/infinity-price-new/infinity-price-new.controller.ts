import {BaseController} from "../BaseController";
import {JsonResponse, TryCatch, Upload} from "../../helper";
import { Application, Handler, Request, Response } from 'express';
import {guard} from "../../helper/Auth";
import InfinityPriceNewBusiness from "./infinity-price-new.business";
import {InfinityPriceRepositoryNew} from "./infinity-price-new.repository";
import {Messages} from "../../constants";
import {IInfinityPriceNew} from "./infinity-price-new.types";
import infinityPriceNewModel from "./infinity-price-new.model";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {InfinityPriceNewValidation} from "./infinity-price-new.validation";
import XLSX from "xlsx";
import {ISku, skuColorTypeEnum} from "../sku/sku.types";
import clarityMasterModel from "../infinity-price/master/clarity-master/clarity-master.model";
import colorMasterModel from "../infinity-price/master/color-master/color-master.model";
import caratMasterModel from "../infinity-price/master/carat-master/carat-master.model";
import infinityPriceMasterModel from "../infinity-price/master/infinity-price-master/infinty-price-master.model";
import mongoose from "mongoose";
import CompanyBusiness from "../company/company.business";
import path from "path";
import * as Excel from "exceljs";
import skuModel from "../sku/sku.model";
import iavModel from "../iav/iav.model";
import rapPriceModel from "../rap-price/rap-price.model";
import skuInfinityPriceModel from "../sku-infinity-price/sku-infinity-price.model";
import { ICaratMaster } from "../infinity-price/master/carat-master/carat-master.types";
import { IClarityMaster } from "../infinity-price/master/clarity-master/clarity-master.types";
import { IColorMaster } from "../infinity-price/master/color-master/color-master.types";
import session from "express-session";


export class InfinityPriceControllerNew extends BaseController<IInfinityPriceNew> {
    constructor() {
        super(new InfinityPriceNewBusiness(), "infinity-price-new");
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/infinity-price-new', guard, this.router)

    init() {
        const validation: InfinityPriceNewValidation = new InfinityPriceNewValidation()
        this.router.get("/index-white", TryCatch.tryCatchGlobe(this.indexWhite));
        this.router.get("/index-off-white", TryCatch.tryCatchGlobe(this.indexOffWhite));
        this.router.get("/index-fancy", TryCatch.tryCatchGlobe(this.indexFancy));
        this.router.get("/export", TryCatch.tryCatchGlobe(this.export));
        this.router.post("/", validation.add, TryCatch.tryCatchGlobe(this.createBC));
        this.router.get("/filter-params-white", TryCatch.tryCatchGlobe(this.filterParamWhite));
        this.router.post("/bulk", validation.addBulk, MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.addBulk));
        this.router.post("/import-infinity-price-with-master", Upload.uploadFile('/uploads/excels').single("file"), guard, MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.importInfinityPriceWithMaster));
        // this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        // this.router.get("/combination-white/index", TryCatch.tryCatchGlobe(this.combinationArrayIndexWhite));
        // this.router.get("/combination-fancy/index", validation.combinationArrayFancyIndex, TryCatch.tryCatchGlobe(this.combinationArrayIndexFancy));
        // this.router.get("/combination", TryCatch.tryCatchGlobe(this.combinationArray))
        // this.router.post("/", validation.createInfinityPrice, transaction.startTransaction, TryCatch.tryCatchGlobe(this.create));
        // this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter));
    }
    //insert then get clarity, color, for that company create skuinfinity price in nser id in sku.

    async indexWhite(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new InfinityPriceRepositoryNew().indexWhite(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.indexWhite`);
    }

    async indexOffWhite(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new InfinityPriceRepositoryNew().indexOffWhite(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.indexOffWhite`);
    }

    async indexFancy(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new InfinityPriceRepositoryNew().indexFancy(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.indexFancy`);
    }

    addBulk: Handler = async (req, res): Promise<void> => {
        res.locals = {status: false, message: Messages.CREATE_FAILED};
        let data: any;
        const {mongoSessionNew: mongoSession, body: {newData, loggedInUser:{_id:loggedInUserId}}} = req as any;
        await mongoSession.withTransaction(async() => await new InfinityPriceRepositoryNew().addBulk(newData, loggedInUserId, mongoSession))
        res.locals = {status: true, data: 1, message: Messages.CREATE_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.addBulk`);
    }

    async filterParamWhite(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req;
        let data = await new InfinityPriceRepositoryNew().filterParamWhite(loggedInUserId, req.query);
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

    async export(req: Request, res: Response): Promise<void|any> {
        if(!req?.query?.stoneType) throw 'Stone is Required.'
        const fileName = `InfinityPrice${req?.query?.stoneType}.xlsx`
        let workbook = new Excel.Workbook(), excelData: any[] = [];
        let worksheet = workbook.addWorksheet(`InfinityPrice${req?.query?.stoneType}`)
        let headerData = [
            { name: 'color', filterButton: true }, { name: 'clarity', filterButton: true },
            { name: 'fromCarat', filterButton: true }, { name: 'toCarat', filterButton: true },
            { name: 'price', filterButton: true }
        ]
        const offWhiteOrFancyHeader = [
            {name: 'clientPriceMin', filterButton: true}, {name: 'clientPriceMax', filterButton: true}, {name: 'clientPriceAvg', filterButton: true}
        ]
        const whiteHeader = [
            { name: 'rapPriceMin', filterButton: true }, { name: 'rapPriceMax', filterButton: true },
            { name: 'rapPriceAvg', filterButton: true }, { name: 'rapNetPriceMin', filterButton: true },
            { name: 'rapNetPriceMax', filterButton: true }, { name: 'rapNetPriceAvg', filterButton: true }
        ]

        const data = await new InfinityPriceRepositoryNew().export(req.query as any)

        if(req?.query?.stoneType == skuColorTypeEnum.WHITE) {
            headerData.push(...whiteHeader)
            excelData = data.map(
                ({price, clarity, color, fromCarat, toCarat, rapPriceMin,
                 rapPriceMax, rapPriceAvg, rapNetPriceMin, rapNetPriceMax, rapNetPriceAvg}) =>
                [color, clarity, fromCarat, toCarat, price, rapPriceMin,
                rapPriceMax, rapPriceAvg, rapNetPriceMin, rapNetPriceMax, rapNetPriceAvg]
            )
        }
        else if([skuColorTypeEnum.OFF_WHITE, skuColorTypeEnum.FANCY].includes(req?.query?.stoneType as skuColorTypeEnum)) {
            headerData.push(...offWhiteOrFancyHeader)
            excelData = data.map(
                ({price, clarity, color, fromCarat, toCarat, clientPriceMin, clientPriceMax, clientPriceAvg}) =>
                [color, clarity, fromCarat, toCarat, price, clientPriceMin, clientPriceMax, clientPriceAvg]
            )
        }

        await new CompanyBusiness().exportExcel(worksheet, headerData, excelData)
        await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
        await res.download(path.join(__dirname, `${fileName}`), (err) => {
            if (err) {
                res.status(400).json({status: 400, success: false, message: err})
            }
            console.log("DownloadError", err);
        })
    }

    async importInfinityPriceWithMaster(req: Request, res: Response){
        const {mongoSessionNew: session, body:{loggedInUser:{_id:loggedInUserId}}} = req as any
        if(!req?.file?.path) throw new Error('Invalid File.')
        //@ts-expect-error
        let file: any = await new XLSX.readFile(req?.file?.path);
        const sheet: string = file.SheetNames[0]
        let limit: number = 0, data: any[] = [], clarityObject: any = {}, colorObject: any = {}, price: string, effectiveDate: string
        let clarity: string, color: string, stoneType:string,minWeight: number, maxWeight: number, maxWeightToFind: number[] = [], updateSku: any[] = []
        let colorToFind: string[] = [], clarityToFind: string[] = [], minWeightToFind: number[] = [], priceNewData: any[] =[], skuInfinityPriceInsert: any[] = []
        let caratToInsert: ICaratMaster[] = [], clarityToInsert: IClarityMaster[] = [], colorToInsert: IColorMaster[] = []
        await session.withTransaction(async() => {
            limit = Number(file.Sheets[sheet]['!ref'].split(':')[1].slice(1));
            minWeight = file.Sheets[sheet].A1.v;
            maxWeight = file.Sheets[sheet].B1.v;
            clarity = file.Sheets[sheet].C1.v;
            color = file.Sheets[sheet].D1.v;
            stoneType = file.Sheets[sheet].E1.v;
            price = file.Sheets[sheet].F1.v;
            effectiveDate = file.Sheets[sheet].G1.v;

            for(let i = 2; i <= limit; i++) {
                const infinityPriceMasterId = mongoose.Types.ObjectId()
                const infinityPriceId = mongoose.Types.ObjectId()

                data.push({
                    [minWeight]: file.Sheets[sheet][`A${i}`].v, [maxWeight]: file.Sheets[sheet][`B${i}`].v,
                    [clarity]: file.Sheets[sheet][`C${i}`].v, [color]: file.Sheets[sheet][`D${i}`].v,
                    createdBy: loggedInUserId, updatedBy: loggedInUserId, _id: infinityPriceMasterId
                })

                priceNewData.push({
                    price: file.Sheets[sheet][`F${i}`].v, stoneType: file.Sheets[sheet][`E${i}`].v,   //Todo use consistent word throughout system stoneType or colorType
                    createdBy: loggedInUserId,  effectiveDate: file.Sheets[sheet][`G${i}`].v,
                    updatedBy: loggedInUserId, infinityPriceMasterId, _id: infinityPriceId
                })

                minWeightToFind.push(file.Sheets[sheet][`A${i}`].v)
                maxWeightToFind.push(file.Sheets[sheet][`B${i}`].v)
                clarityToFind.push(file.Sheets[sheet][`C${i}`].v)
                colorToFind.push(file.Sheets[sheet][`D${i}`].v)

                updateSku.push({
                    cond: {$and: [{isDeleted: false}, {colorType: file.Sheets[sheet][`E${i}`].v},
                        {clarity: file.Sheets[sheet][`C${i}`].v}, {colorCategory: file.Sheets[sheet][`D${i}`].v},
                        {weight: {$gte: file.Sheets[sheet][`A${i}`].v}}, {weight: {$lte: file.Sheets[sheet][`B${i}`].v}}
                    ]},
                    update: {updatedBy: loggedInUserId},
                    skuInfinityPrice: file.Sheets[sheet][`F${i}`].v
                })
            }

            minWeightToFind = [...new Set(minWeightToFind)]
            maxWeightToFind = [...new Set(maxWeightToFind)]
            clarityToFind = [...new Set(clarityToFind)]
            colorToFind = [...new Set(colorToFind)]

            let [weightData, clarityData, colorData] = await Promise.all([
                await caratMasterModel.find({isDeleted: false, fromCarat: {$in: minWeightToFind}, toCarat: {$in: maxWeightToFind}}).select('fromCarat toCarat').lean(),
                // await caratMasterModel.find({isDeleted: false}).select('fromCarat toCarat').lean(),
                await clarityMasterModel.find({isDeleted: false, clarity: {$in: clarityToFind}}).select('clarity').lean(),
                await colorMasterModel.find({isDeleted: false, color: {$in: colorToFind}}).select('color').lean(),
                await infinityPriceMasterModel.deleteMany({}, {session}),
                await infinityPriceNewModel.deleteMany({}, {session})
            ])

            await clarityData.forEach(clarity => clarityObject[clarity.clarity] = clarity)
            await colorData.forEach(color => colorObject[color.color] = color)

            let clarityObjectToInsert: any = {}, colorObjectToInsert: any = {}

            await data.forEach(dd => {
                let weightFound = false;
                weightData.forEach(weight => {
                    if(dd[minWeight] == weight.fromCarat && dd[maxWeight] == weight.toCarat)
                    {
                        weightFound = true ;
                        dd['caratRangeMasterId'] = weight?._id
                    }
                    
                })

                !weightFound && caratToInsert.forEach(weight => {
                    if(dd[minWeight] == weight.fromCarat && dd[maxWeight] == weight.toCarat)
                    {
                        weightFound = true ;
                        dd['caratRangeMasterId'] = weight?._id
                    }
                })

                if(!weightFound) {
                    let id = mongoose.Types.ObjectId()
                    dd['caratRangeMasterId'] = id
                    // @ts-expect-error
                    caratToInsert.push({_id: id, fromCarat: dd[minWeight], toCarat: dd[maxWeight], createdBy: loggedInUserId, updatedBy: loggedInUserId})
                }

                if(clarityObject[dd[clarity]]?._id) dd['clarityMasterId'] = clarityObject[dd[clarity]]._id
                else {
                    let id: mongoose.Types.ObjectId
                    // console.log(clarityObjectToInsert[dd['Clarity']]?._id,'clarityObjectToInsert[dd[clarity]]?._id', dd['Clarity'], dd, 'jj')
                    if(clarityObjectToInsert[dd['Clarity']]) id = clarityObjectToInsert[dd['Clarity']]?._id
                    else {
                        id = mongoose.Types.ObjectId()
                        clarityObjectToInsert[dd['Clarity']] = {_id: id}
                        //@ts-expect-error
                        clarityToInsert.push({_id: id, clarity: dd['Clarity'], createdBy: loggedInUserId, updatedBy: loggedInUserId})
                    }
                    dd['clarityMasterId'] = id
                }

                if(colorObject[dd[color]]?._id) dd['colorMasterId'] = colorObject[dd[color]]._id
                else {
                    let id: mongoose.Types.ObjectId
                    // console.log(clarityObjectToInsert[dd['Clarity']]?._id,'clarityObjectToInsert[dd[clarity]]?._id', dd['Clarity'], dd, 'jj')
                    if(colorObjectToInsert[dd['Color']]?._id) id = colorObjectToInsert[dd['Color']]?._id
                    else {
                        id = mongoose.Types.ObjectId()
                        colorObjectToInsert[dd['Color']] = {_id: id}
                        //@ts-expect-error
                        colorToInsert.push({_id: id, color: dd['Color'], createdBy: loggedInUserId, updatedBy: loggedInUserId})
                    }
                    dd['colorMasterId'] = id
                }
            })

            const update = updateSku.map(async(el) => {
                const sku = await skuModel.aggregate<ISku & {rapPriceStone: number}>([
                    {$match: el.cond},
                    {$lookup: {
                        from: iavModel.collection.name, as: 'iav',
                        let: {iavId: '$iavId'},
                        pipeline: [
                            {$match: {$and: [{$expr: {$eq: ['$_id', '$$iavId']}}, {isDeleted: false}]}},
                            {$lookup: {
                                from: rapPriceModel.collection.name,
                                as: 'rapPrice',
                                let: {rapPriceId: '$rapPriceId'},
                                pipeline: [{$match: {$expr: {$eq: ['$_id', '$$rapPriceId']}}}]
                            }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},
                        ]
                    }}, {$unwind: {path: "$iav", preserveNullAndEmptyArrays: true}},
                    {$set: {rapPriceStone: {$cond: {if: '$iav.rapPrice.price', then: '$iav.rapPrice.price', else: 0}}}}
                ]).then(([R])=>R)

                if(sku) {
                    const skuInfinityPriceId = mongoose.Types.ObjectId()
                    let totalPrice: number = 0

                    if(sku?.colorType === skuColorTypeEnum.FANCY || sku?.colorType === skuColorTypeEnum.OFF_WHITE) totalPrice = el.skuInfinityPrice * sku.weight
                    else if(sku?.colorType === skuColorTypeEnum.WHITE && el.skuInfinityPrice) totalPrice = ((1-(el.skuInfinityPrice/100))*sku.rapPriceStone)*sku.weight

                    await skuModel.updateOne(el.cond, {...el.update, skuInfinityPriceId}, {session})
                    skuInfinityPriceInsert.push({skuId: sku._id, price: el.skuInfinityPrice, totalPrice, createdBy: loggedInUserId, updatedBy: loggedInUserId, _id: skuInfinityPriceId})
                }
            })

            await Promise.all(update)
            await Promise.all([
                await infinityPriceMasterModel.insertMany(data, {session}),
                await infinityPriceNewModel.insertMany(priceNewData, {session}),
                await caratMasterModel.insertMany(caratToInsert, {session}),
                await clarityMasterModel.insertMany(clarityToInsert, {session}),
                await colorMasterModel.insertMany(colorToInsert, {session}),
                await skuInfinityPriceModel.insertMany(skuInfinityPriceInsert, {session}),
            ])
            res.locals.message = Messages.SUCCESSFULLY_FILE_IMPORTED;
        })
        await JsonResponse.jsonSuccess(req, res, "importInfinityPriceWithMaster");
    }

    // async index(req: Request, res: Response): Promise<void> {
    //     res.locals = {status: false, message: Messages.FETCH_FAILED};
    //     const {data, page}: any = await new InfinityPriceRepositoryNew().index(req.query as any)
    //     res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    // }
    //
    // async combinationArrayIndexWhite(req: Request, res: Response): Promise<void> {
    //     res.locals = {status: false, message: Messages.FETCH_FAILED};
    //     const {data, page}: any = await new InfinityPriceRepositoryNew().combinationArrayIndexWhite(req.query as any)
    //     res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    // }
    //
    // async combinationArrayIndexFancy(req: Request, res: Response): Promise<void> {
    //     res.locals = {status: false, message: Messages.FETCH_FAILED};
    //     const {data, page}: any = await new InfinityPriceRepositoryNew().combinationArrayIndexFancy(req.query as any)
    //     res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    // }
    //
    // create = async(req: Request, res: Response) => {
    //     res.locals = {status: false, message: Messages.CREATE_FAILED};
    //     let {body, mongoSession, body:{infinityPriceData, loggedInUser:{_id:loggedInUserId, companyId}}} = req as RequestWithTransaction
    //
    //     infinityPriceData.forEach((element: IInfinityPriceNew) => element.createdBy = element.updatedBy = loggedInUserId);
    //     let data = await new InfinityPriceRepositoryNew().create(infinityPriceData, mongoSession)
    //     res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    // }
    //
    // async filter(req: Request, res: Response): Promise<void> {
    //     res.locals = {status: false, message: Messages.FETCH_FAILED}
    //     let {body: {loggedInUser:{_id: loggedInUserId}}} = req
    //     let data = await new InfinityPriceRepositoryNew().filter(loggedInUserId)
    //     if (data) {
    //         data.price = { max: Math.max(...data.prices), min: Math.min(...data.prices), values: data.prices.sort((n1: number, n2: number) => n1 - n2) };
    //     }
    //     res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    // }
    //
    // async combinationArray(req: Request, res: Response): Promise<void> {
    //     res.locals = {status: false, message: Messages.FETCH_FAILED};
    //     let {body: {loggedInUser:{_id: loggedInUserId}}} = req;
    //     let data = await new InfinityPriceRepositoryNew().combinationArray()
    //     let combinationData = await new InfinityPriceRepositoryNew().combination(data)
    //     res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data: combinationData}
    //     res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data: data}
        // await JsonResponse.jsonSuccess(req, res, `{this.url}.combinationArray`);
    // }
//
}
