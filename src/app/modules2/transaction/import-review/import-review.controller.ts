import {BaseController} from "../../BaseController"
import {Application, Request, Response} from "express"
import {JsonResponse, TryCatch} from "../../../helper"
import {guard} from "../../../helper/Auth"
import {ITransactionImportReview} from "./import-review.types"
import TransactionImportReviewBusiness from "./import-review.business"
import {TransactionImportReviewRepository} from "./import-review.repository"
import {Messages} from "../../../constants"
import {MongooseTransaction} from "../../../helper/MongooseTransactions";
import {RequestWithTransaction} from "../../../interfaces/Request";
import {TransactionImportReviewValidation} from "./import-review.validation"
import {TransactionRepository} from "../transaction.repository";
import * as Excel from 'exceljs'
import path from 'path'


export class TransactionImportReviewController extends BaseController<ITransactionImportReview> {
    constructor() {
        super(new TransactionImportReviewBusiness(), "transactionImportReview", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/transaction/import-review', guard, this.router);
    }

    init() {   //Todo write validation
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation:  TransactionImportReviewValidation = new TransactionImportReviewValidation();
        this.router.get("/",TryCatch.tryCatchGlobe(this.find))  //Todo bheemaraj told no use of this api
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.get("/detail", TryCatch.tryCatchGlobe(this.findReview))
        this.router.put("/",validation.updateTransactionImportReview , transaction.startTransaction, TryCatch.tryCatchGlobe(this.update))
        this.router.post("/",TryCatch.tryCatchGlobe(this.create))
        this.router.get("/detail/filterCriteria", TryCatch.tryCatchGlobe(this.filterReview))
        this.router.get("/exportExcel", TryCatch.tryCatchGlobe(this.exportReport));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
    }

    async find(req: Request, res: Response): Promise<void> {
        const { query: { transactionId } } = req
        let data = await new TransactionImportReviewRepository().find(transactionId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.find`);
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new TransactionImportReviewRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    // async findReview(req: Request, res: Response): Promise<void> {
    //     let { query: { transactionId } } = req
    //     let skuIds = await new TransactionImportReviewRepository().getSkuIds(transactionId)
    //     await new TransactionImportReviewController().paginationOfAnArray(req, res, skuIds)
    // }

    async findReview(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        //@ts-expect-error
        req.query.transactionData = await new TransactionImportReviewRepository().findOneBR({transactionId: req?.query?.transactionId});
        const {data, header, page}: any = await new TransactionRepository().findReviewBR(req.query as any)
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async filterReview(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let transactionData = await new TransactionImportReviewRepository().findOneBR({transactionId: req?.query?.transactionId});
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
            data.dmStatus = ["MATCHED", "NOTMATCHED"]
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

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{loggedInUser:{_id:loggedInUserId}}, mongoSession} = req as RequestWithTransaction
        body.createdBy = body.updatedBy = loggedInUserId
        let data = await new TransactionImportReviewRepository().create(body, mongoSession)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    async update(req: Request, res: Response): Promise<void> {
        let {body , body: { transactionId, skuId, approvedBy }, mongoSession  } = req as RequestWithTransaction
        let data = await new TransactionImportReviewRepository().update(body, mongoSession)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data: 1}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    async exportReport(req: Request, res: Response): Promise<void> {
        let workbook = new Excel.Workbook();
        //@ts-expect-error
        req.query.transactionData = await new TransactionImportReviewRepository().findOneBR({ transactionId: req?.query?.transactionId });
        // console.log("---------------DB-----",data);
        const { data, page }: any = await new TransactionRepository().findReviewBR(req.query as any)

        let headerData = [{ name: 'Ref #', filterButton: true }, { name: 'Movement Status', filterButton: true }, { name: 'Company', filterButton: true }, { name: 'Report Lab', filterButton: true }, { name: 'Report Number', filterButton: true }, { name: 'Shape', filterButton: true },
        { name: 'Color Sub-Category', filterButton: true }, { name: 'Carat Weight', filterButton: true }, { name: 'Color Category', filterButton: true }, { name: 'Grading Color', filterButton: true }, { name: 'Grading Shape', filterButton: true }, { name: 'Clarity', filterButton: true }, { name: 'Cut', filterButton: true }, { name: 'DRV', filterButton: true },
        { name: 'IAV', filterButton: true }, { name: 'PWV', filterButton: true }]

        let requiredData = [];
        let arr: any[] = []
        // requiredData.push(arr);
        for (let i = 0; i < data.length; i++) {

            arr = [data[i].rfId?.rfid, data[i].movementStatus, data[i].companyId?.name, data[i].labsId.lab, data[i].labsId.labReportId, data[i].shape, data[i].colorSubCategory, data[i].weight, data[i].colorCategory, data[i].gradeReportColor, data[i].gradeReportShape, data[i].clarity, data[i].cut, data[i].iavId?.drv, data[i].iavId?.iav, data[i].iavId?.pwv];
            requiredData.push(arr);
        }

        let worksheet = workbook.addWorksheet('TransactionImportReview Export')
        await new TransactionRepository().exportExcel(worksheet, headerData, requiredData)
        let fileName = 'TransactionImportReview-Export.xlsx'
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

        let data = await new TransactionImportReviewRepository().aggregateBR(aggregateCond).then(data => data[0])
        console.log(data);
        
        res.locals = { status: true, message: Messages.FETCH_SUCCESSFUL, data };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findReview`);
    }
}