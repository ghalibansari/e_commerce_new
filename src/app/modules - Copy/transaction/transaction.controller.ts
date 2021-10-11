import {BaseController} from "../BaseController"
import {Application, Request, Response} from "express"
import {TryCatch, JsonResponse} from "../../helper"
import {guard} from "../../helper/Auth"
import { ITransaction } from "./transaction.types"
import TransactionBusiness from "./transaction.business"
import ActivityBusiness from "../activity/activity.business"
import {Messages} from "../../constants/Messages"
import SkuBusiness from "../sku/sku.business"
import * as Excel from 'exceljs'
import path from 'path'
import {UserRepository} from "../user/user.repository";
import {TransactionRepository} from "./transaction.repository";
import {TransactionConsignmentController} from "./consignment/consignment.controller";

export class TransactionController extends BaseController<ITransaction> {
    constructor() {
        super(new TransactionBusiness(), "transaction", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/transaction', guard, this.router);
    }

    init() {   //Todo write validation
        // const validation: StatusValidation = new StatusValidation();
        this.router.get("/",TryCatch.tryCatchGlobe(this.findBC))
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.get("/review", TryCatch.tryCatchGlobe(this.findReview));
        // this.router.post("/", TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", TryCatch.tryCatchGlobe(this.updateBC));
        // this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        // this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.get("/exportExcel", TryCatch.tryCatchGlobe(this.exportExcel))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page, header}: any = await new TransactionRepository().index(req.query as any)
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async findReview(req: Request, res: Response): Promise<void> {
        let { query: { transactionId } } = req
        let transactionData: any = await new TransactionBusiness().findOneBB({ transactionId: transactionId }, []);
        let skuIds = await new SkuBusiness().findBB({ _id: { $in: transactionData.skuIds } }, {}, {}, -1, 0, [])        
        await new TransactionController().paginationOfAnArray(req, res, skuIds)
        // res.send(transactionData)
    }

    async exportExcel(req: Request, res: Response): Promise<void> {
        let workbook = new Excel.Workbook();
        let populate = [{
            path: 'skuIds', populate: [{path: 'labsId', model: 'Lab'}, {path: 'companyId', model: 'Company'},
                {path: 'iavId', model: 'Iav'}, {path: 'rfId', model: 'rfid'}]}, { path: 'createdBy' }, { path: 'updatedBy' }];
        let dbData = [];
        dbData = await new TransactionController().exportBC(req, res, populate)
        let headerData = [{ name: 'TransactionId' }, { name: 'TransactionType' }, { name: 'lab' }, { name: "company" }, { name: "clientRefId" }, { name: "infinityRefId" }, { name: "weight" }, { name: "shape" }, { name: "colorType" }, { name: "clarity" }, { name: "dmGuid" }, { name: "pwvImport" }, { name: "iav" }, { name: "drv" }, { name: "pwv" }, { name: "rfid" }, { name: 'status' }, { name: "updatedBy" }, { name: "createdBy" }, { name: "createdAt" }, { name: "updatedAt" }]

        let requiredData = [];
        let arr: any[] = []
        //console.log(dbData);
        if (dbData[0]?.skuIds?.length == 0) {
            res.locals = { status: false, message: Messages.NO_SKU_DATA }
            await JsonResponse.jsonSuccess(req, res, `{this.url}.exportExcel`);
        } else {
            let skuArry = dbData[0].skuIds
            // console.log("===++++++",skuArry);
            for (let j = 0; j < skuArry.length; j++) {
                arr = [dbData[0].transactionId, dbData[0].transactionType, skuArry[j]?.labsId[0].lab, skuArry[j]?.companyId.name, skuArry[j]?.clientRefId, skuArry[j]?.infinityRefId, skuArry[j]?.weight, skuArry[j]?.shape, skuArry[j]?.colorType, skuArry[j]?.clarity, skuArry[j]?.dmGuid, skuArry[j]?.pwvImport, skuArry[j]?.iavId?.iav, skuArry[j]?.iavId?.drv, skuArry[j]?.iavId?.pwv, skuArry[j]?.rfId?.rfid, dbData[0].status, dbData[0].updatedBy?.firstName + ' ' + dbData[0].updatedBy?.lastName, dbData[0].createdBy?.firstName + ' ' + dbData[0].createdBy?.lastName, dbData[0].createdAt, dbData[0].updatedAt,]
                requiredData.push(arr);
            }
            let worksheet = workbook.addWorksheet('Transaction Export')
            await new TransactionBusiness().createTable(worksheet, headerData, requiredData)
            let fileName = 'TransactionExport.xlsx'
            let fileRespo = await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
            res.download(path.join(__dirname, `${fileName}`), (err) => {
                if (err) {
                    { res.status(400).json({ status: 400, success: false, message: err }) }
                    console.log("DownloadError", err);
                }
            })
        }
    }

}