import {BaseController} from "../../BaseController"
import {Application, Request, Response} from "express"
import {JsonResponse, TryCatch} from "../../../helper"
import {guard} from "../../../helper/Auth"
import TransactionImportBusiness from "./import.business"
import {ITransactionImport} from "./import.types"
import {TransactionImportRepository} from "./import.repository"
import {Messages} from "../../../constants";
import {TransactionRepository} from "../transaction.repository";
import * as Excel from 'exceljs'
import path from 'path'
import {HeaderData} from '../../../constants/ReportHeaders'
import { SkuRepository } from "app/modules/sku/sku.repository"
import { TransactionImportValidation } from "./import.validation"
import { IUser } from "../../user/user.types"
import { DisplayConfigurationRepository } from "../../display-configuration/display-configuration.repository"
import { disPlayConfigindex } from "../../../helper/displayConfigData"
import { Json } from "sequelize/types/lib/utils"
import { ISku, skuCollateralStatusEnum, skuStoneStatusEnum } from "../../sku/sku.types"
import lo from "lodash"
import { SkuController } from "app/modules/sku/sku.controller"

export class TransactionImportController extends BaseController<ITransactionImport> {
    constructor() {
        super(new TransactionImportBusiness(), "transactionImport", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/transaction/import', guard, this.router);
    }

    init() {   //Todo write validation
        const validation: TransactionImportValidation = new TransactionImportValidation();
        this.router.get("/",TryCatch.tryCatchGlobe(this.find))
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.get("/detail", TryCatch.tryCatchGlobe(this.findReview))
        this.router.get("/detail/filterCriteria", TryCatch.tryCatchGlobe(this.filterReview))
        this.router.get("/exportExcel", TryCatch.tryCatchGlobe(this.exportReport));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
        this.router.get("/export", TryCatch.tryCatchGlobe(this.exportExcel))
        this.router.put("/update-review-status", validation.updateReviewStatus, TryCatch.tryCatchGlobe(this.updateReviewStatus))
    }

    async find(req: Request, res: Response): Promise<void> {
        let populate = [{path: "companyId"},{path: "createdBy"}, {path: "updatedBy"}]
        await new TransactionImportController().findBC(req, res, populate)
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new TransactionImportRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    // async findReview(req: Request, res: Response): Promise<void> {
    //     let skuIds = await new TransactionImportRepository().getSkuIds(req?.query?.transactionId)
    //     await new TransactionImportController().paginationOfAnArray(req, res, skuIds)
    // }

    async findReview(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        //@ts-expect-error
        req.query.transactionData = await new TransactionImportRepository().findOneBR({transactionId: req?.query?.transactionId}, {}, [{path: "companyId"}]);
        const {data, header, page}: any = await new TransactionImportRepository().findReviewBR(req.query as any)
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findReview`);
    }

    async filterReview(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let transactionData = await new TransactionImportRepository().findOneBR({transactionId: req?.query?.transactionId});
        //@ts-expect-error
        let data = await new TransactionRepository().filterBR(transactionData?.skuIds)
        if (data) {
            data.labs = [].concat.apply([], data.labs);
            data.labs = [...new Set(data.labs.map((labData: any) => labData.lab))]
            data.weight = { max: Math.max(...data.uniqueWeight), min: Math.min(...data.uniqueWeight), values: data.uniqueWeight.sort((n1: number, n2: number) => n1 - n2) }
            data.iav = { max: Math.max(...data.uniqueIav), min: Math.min(...data.uniqueIav), values: data.uniqueIav.sort((n1: number, n2: number) => n1 - n2) }
            data.pwv = { max: Math.max(...data.uniquePwv), min: Math.min(...data.uniquePwv), values: data.uniquePwv.sort((n1: number, n2: number) => n1 - n2) }
            data.drv = { max: Math.max(...data.uniqueDrv), min: Math.min(...data.uniqueDrv), values: data.uniqueDrv.sort((n1: number, n2: number) => n1 - n2) }
            let rapPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueRapPrices.sort((n1: number, n2: number) => n1 - n2) }
            data.price = { rapPrice }
            let clientPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueClientPrices.sort((n1: number, n2: number) => n1 - n2) }
            data.price = { ...data.price, clientPrice }
            data.company.sort((a: any, b: any) => {return  (a.sorted).localeCompare(b.sorted);});
            // data.dmStatus = ["MATCHED", "NOTMATCHED"]
            data.stoneRegistration = [true,false]
            delete data.uniqueWeight
            delete data.uniqueIav
            delete data.uniquePwv
            delete data.uniqueDrv
            delete data.uniqueClientPrices
            delete data.uniqueRapPrices
        }
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findReview`);
    }
    
    async exportReport(req: Request, res: Response): Promise<void> {
        let workbook = new Excel.Workbook();
        //@ts-expect-error
        req.query.transactionData = await new TransactionImportRepository().findOneBR({ transactionId: req?.query?.transactionId });
        // console.log("---------------DB-----",data);
        const { data, page }: any = await new TransactionImportRepository().findReviewBR(req.query as any)

        let headerData = [{ name: 'Ref #', filterButton: true }, { name: 'Stone Status', filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true },{ name: 'Collateral Status', filterButton: true },{ name: 'Gemologist Status', filterButton: true },{ name: 'Shape', filterButton: true },
        { name: 'Color Sub-Category', filterButton: true }, { name: 'Carat Weight', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'DRV', filterButton: true },
        { name: 'IAV', filterButton: true }, { name: 'PWV', filterButton: true }]

        let requiredData = [];
        let arr: any[] = []
        // requiredData.push(arr);
        for (let i = 0; i < data.length; i++) {

            arr = [data[i].rfId?.rfid, data[i].stoneStatus, data[i].companyId?.name, data[i].labsId.lab, data[i].labsId.labReportId, data[i].collateralStatus,data[i].gemlogistStatus, data[i].shape, data[i].colorSubCategory, data[i].weight, data[i].colorCategory, data[i].gradeReportColor, data[i].gradeReportShape, data[i].clarity, data[i].cut, data[i].iavId?.drv, data[i].iavId?.iav, data[i].iavId?.pwv];
            requiredData.push(arr);
        }

        let worksheet = workbook.addWorksheet('TransactionImport Export')
        await new TransactionRepository().exportExcel(worksheet, headerData, requiredData)
        let fileName = 'TransactionImport-Export-summary.xlsx'
        await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
        res.download(path.join(__dirname, `${fileName}`), (err) => {
            if (err) {
                if (err) { res.status(400).json({ status: 400, success: false, message: err }) }
                console.log("DownloadError", err);
            }
        })
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.FETCH_FAILED };

        let aggregateCond: any = [
            { $match: { "isDeleted": false } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $group: { _id: null, "company": { "$addToSet": "$companyId" } } },
            { $project: { _id: 0, "company.name": 1, "company._id": 1 } }
        ]

        let data = await new TransactionImportRepository().aggregateBR(aggregateCond).then(data => data[0])
        console.log(data);
        
        res.locals = { status: true, message: Messages.FETCH_SUCCESSFUL, data };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findReview`);
    }

    async exportExcel(req: Request, res: Response): Promise<void> {
        req.query.displayConfig = [{"key":"screen","value":"InventoryImportReview"}]
        let pendingStones : ISku[] = [], rejectedStones: ISku[] = [], priceChangedStones: ISku[] = [], approvedStones: ISku[] = [],collateralStones: ISku[] = []
        let filters = req.query.filters;
        let displayconfig = await disPlayConfigindex(req);        
        const header: any = [];
        displayconfig[0].config.map((item: any) => {if(item.isActive === true) header.push({ name: item.text, filterButton: true, valKey: item.valKey })});
        req.query.filters = filters;
        // @ts-expect-error
        req.query.transactionData = await new TransactionImportRepository().findOneBR({ transactionId: req?.query?.transactionId }, {}, [{ path: "companyId" }]);
        let { data, page }: any = await new TransactionImportRepository().findReviewBR(req.query as any)
        console.log(data.length, "===========");
        
        data.forEach((sku: ISku) => {
            if(sku.collateralStatus === skuCollateralStatusEnum.COLLATERAL_IN) collateralStones.push(sku)

            if(sku.stoneStatus === skuStoneStatusEnum.ARRIVAL) pendingStones.push(sku);
            if(sku.stoneStatus === skuStoneStatusEnum.REJECTED) rejectedStones.push(sku);
            if(sku.stoneStatus === skuStoneStatusEnum.PRICE_CHANGED) priceChangedStones.push(sku);
            if(sku.stoneStatus === skuStoneStatusEnum.APPROVED) approvedStones.push(sku);   
        });

        console.log(pendingStones.length, "=====================", rejectedStones.length, "=============", approvedStones.length, "==============", collateralStones.length, "==============", priceChangedStones.length);
        const TransImportControllerInstance = new TransactionImportController()
        let workbook = new Excel.Workbook();
        let worksheet1 = workbook.addWorksheet('Pending Review')
        let worksheet2 = workbook.addWorksheet('Rejected')
        let worksheet3 = workbook.addWorksheet('Approved Subject to Price Change')
        let worksheet4 = workbook.addWorksheet('Approved')
        let worksheet5 = workbook.addWorksheet('In Collateral')

        let isSumFlag = false
        await Promise.all([
            await new TransactionRepository().exportExcel(worksheet1, header, await TransImportControllerInstance.exportData(pendingStones, displayconfig[0].config)),
            await new TransactionRepository().exportExcel(worksheet2, header, await TransImportControllerInstance.exportData(rejectedStones, displayconfig[0].config)),
            await new TransactionRepository().exportExcel(worksheet3, header, await TransImportControllerInstance.exportData(priceChangedStones, displayconfig[0].config)),
            await new TransactionRepository().exportExcel(worksheet4, header, await TransImportControllerInstance.exportData(approvedStones, displayconfig[0].config)),
            await new TransactionRepository().exportExcel(worksheet5, header, await TransImportControllerInstance.exportData(collateralStones, displayconfig[0].config))    
        ])

        let fileName = 'TransactionImport-Export.xlsx'
        await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
        res.download(path.join(__dirname, `${fileName}`), (err) => {
            if (err) {
                if (err) { res.status(400).json({ status: 400, success: false, message: err }) }
                console.log("DownloadError", err);
            }
        })
    }

    exportData = async (data: ISku[], displayConfig: any) : Promise<any> => {
        let requiredData = [];
        for (const [i, element] of data.entries()) {
            let arr: any[] = []
            for (const item of displayConfig) {
                let valKey = item.valKey.split(".");        
                if(item.isActive === false) continue
                
                if(valKey[valKey.length-1] === "drv" || valKey[valKey.length-1] === "pwv" || valKey[valKey.length-1] === "price")(lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push(0);
                else if(valKey[valKey.length-1] === "iav") (lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push((0.00));
                else if(valKey[valKey.length-1] === "stoneRegistration") (element.stoneRegistration)? arr.push("YES"): arr.push("NO");
                else if(valKey[valKey.length-1] === "dmGuid") (element.dmGuid)? arr.push("completed") : arr.push("Pending");
                else if(valKey[valKey.length-1] === "pwvImport")(lo.get(element, valKey))? arr.push(Number(lo.get(element, valKey))) : arr.push(0);
                else if(valKey[valKey.length-1] === "infinityPrice")(lo.get(element, valKey))? arr.push(Number(lo.get(element, valKey))) : arr.push(0);
                else (lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push('')                       
            }
            // arr = [data[i].rfId?.rfid, data[i].stoneStatus, data[i].companyId?.name, data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].collateralStatus, data[i].gemlogistStatus, data[i].shape, data[i].colorSubCategory, data[i].weight, data[i].colorCategory, data[i].gradeReportColor, data[i].gradeReportShape, data[i].clarity, data[i].cut, data[i].iavId?.drv, data[i].iavId?.iav, data[i].iavId?.pwv];
            requiredData.push(arr);
        }
        // console.log("Length...importData  =============================>", HeaderData.transImport_header.length, data.length + '\n');
        return requiredData
    }

       
    updateReviewStatus = async(req: Request, res: Response): Promise<void> => {
        res.locals = { status: false, message: Messages.UPDATE_FAILED };
        const {body, mongoSession, body: {_id, loggedInUser:{_id:loggedInUserId}}} = req as any;
        let data = await new TransactionImportRepository().updateReviewStatus(body, loggedInUserId)
        res.locals = { status: true, message: Messages.UPDATE_SUCCESSFUL, data };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findReview`);
    }
}