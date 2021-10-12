import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch, Upload} from "../../helper";
import {guard} from "../../helper/Auth";
import {Messages} from "../../constants";
import {IRapNetPrice} from "./rap-net-price.types";
import RapNetPriceBusiness from "./rap-net-price.business";
import {RapNetPriceRepository} from "./rap-net-price.repository";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {RequestWithTransaction} from "../../interfaces/Request";
import {RapNetPriceValidationValidation} from "./rap-net-price.validation";
import rapNetPriceModel from "./rap-net-price.model";
import * as Excel from 'exceljs'
import path from 'path'
import XLSX from "xlsx";
import {skuColorTypeEnum} from "../sku/sku.types";
import caratMasterModel from "../infinity-price/master/carat-master/carat-master.model";
import clarityMasterModel from "../infinity-price/master/clarity-master/clarity-master.model";
import colorMasterModel from "../infinity-price/master/color-master/color-master.model";
import infinityPriceMasterModel from "../infinity-price/master/infinity-price-master/infinty-price-master.model";


export class RapNetPriceController extends BaseController<IRapNetPrice> {
    constructor() {
        super(new RapNetPriceBusiness(), "rap-net-price", true);
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/rap-net-price', guard, this.router)

    init() {
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: RapNetPriceValidationValidation = new RapNetPriceValidationValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/import", Upload.uploadFile('/uploads/excels').single("file"), guard, TryCatch.tryCatchGlobe(this.importRapNetPrice));
        this.router.post("/", validation.createRapNetPrice, transaction.startTransaction, TryCatch.tryCatchGlobe(this.create));
        this.router.get("/filter-criteria", TryCatch.tryCatchGlobe(this.filter));
        this.router.get('/export/template',TryCatch.tryCatchGlobe(this.importTemplate))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page, header}: any = await new RapNetPriceRepository().index(req.query);
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async importRapNetPrice(req: Request, res: Response){
        const {body:{loggedInUser:{_id:loggedInUserId}}} = req as any
        if(!req?.file?.path) throw new Error('Invalid File.')
        //@ts-expect-error
        let file: any = await new XLSX.readFile(req?.file?.path);
        const sheets: string[] = file.SheetNames
        let limit: number = 0, data: any[] = []
        if(sheets.find(sheet => sheet.toLowerCase() == 'price')){
            limit = Number(file.Sheets.price['!ref'].split(':')[1].slice(1));
            for(let i = 2; i <= limit; i++) {
                //Rap Net Date
                const RYear = Number(`20${file.Sheets.price[`N${i}`].w.split('/')[2]}`)
                const RMonth = Number(file.Sheets.price[`N${i}`].w.split('/')[0])-1
                const RDate = Number(file.Sheets.price[`N${i}`].w.split('/')[1])

                //Effective Date
                const EYear = Number(`20${file.Sheets.price[`O${i}`].w.split('/')[2]}`)
                const EMonth = Number(file.Sheets.price[`O${i}`].w.split('/')[0])-1
                const EDate = Number(file.Sheets.price[`O${i}`].w.split('/')[1])

                data.push({
                    shape: file.Sheets.price[`B${i}`].v,
                    clarity: file.Sheets.price[`C${i}`].v,
                    rapList: file.Sheets.price[`D${i}`].v,
                    rapNetDiscount: Number(file.Sheets.price[`E${i}`].v) ?? 0,
                    rapNetBestPriceDiscount: Number(file.Sheets.price[`F${i}`].v) || 0,
                    rapNetAvgPriceDiscount: Number(file.Sheets.price[`G${i}`].v) || 0,
                    rapNetBestPrice: Number(file.Sheets.price[`H${i}`].v) || 0,
                    rapNetAvgPrice: Number(file.Sheets.price[`I${i}`].v) || 0,
                    color: file.Sheets.price[`J${i}`].v,
                    weightRange: {fromWeight: file.Sheets.price[`K${i}`].v, toWeight: file.Sheets.price[`L${i}`].v},
                    weight: file.Sheets.price[`M${i}`].v,
                    rapNetDate: new Date(RYear, RMonth, RDate),
                    effectiveDate: new Date(EYear, EMonth, EDate),
                    price: file.Sheets.price[`P${i}`].v,
                    createdBy: loggedInUserId, updatedBy: loggedInUserId
                })
            }

            await rapNetPriceModel.insertMany(data)
        }
        else throw new Error('No Price Sheet found in Excel.')
        res.locals.message = Messages.SUCCESSFULLY_FILE_IMPORTED;
        await JsonResponse.jsonSuccess(req, res, "email");
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new RapNetPriceRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

    create = async(req: Request, res: Response) => {
        res.locals = {status: false, message: Messages.CREATE_FAILED};
        let { body, mongoSession, body: { rapNetData, loggedInUser: { _id: loggedInUserId } } } = req as RequestWithTransaction;
        console.log(mongoSession);
        
        rapNetData.forEach((element: IRapNetPrice) => element.createdBy = element.updatedBy = loggedInUserId);
        //@ts-ignore    //Todo remove-this-line-ts-ignore
        let data = await rapNetPriceModel.create(rapNetData, {mongoSession})
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    importTemplate = async (req: Request, res: Response) => {
        let workbook = new Excel.Workbook();
        let headerData = [{ name: "price_id", filterButton: true }, { name: "shape", filterButton: true }, { name: "clarity", filterButton: true }, { name: "RapList", filterButton: true }, { name: "RapNet Discount %", filterButton: true }, { name: "RapNet Best Price Discount", filterButton: true }, { name: "RapNet Avg Price Discount", filterButton: true }, { name: "RapNet Best Price", filterButton: true }, { name: "RapNet Avg Price", filterButton: true }, { name: "color", filterButton: true }, { name: "carat_min", filterButton: true }
            , { name: "carat_max", filterButton: true }, { name: "weight", filterButton: true }, { name: "date", filterButton: true }, { name: "price", filterButton: true }]

        let requiredData = [[1, "BR", "I2", "xxxx", "xx%", "xxx", "xxx", "xxxx", "xxxx", "D", "xxx", "xxx", "xxx", "xx-xx-xxxx", "xxxx"]];

        let worksheet = workbook.addWorksheet('rapNetImport template')

        await new RapNetPriceBusiness().createTableData(worksheet, headerData, requiredData)
        let fileName = 'rapNetTableImport.xlsx'
        await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
        res.download(path.join(__dirname, `${fileName}`), (err) => {
            if (err) {
                if (err) { res.status(400).json({ status: 400, success: false, message: err }) }
                console.log("DownloadError", err);
            }
        })
    }

}