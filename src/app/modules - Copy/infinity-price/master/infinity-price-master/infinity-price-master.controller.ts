import {BaseController} from "../../../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch, Upload} from "../../../../helper";
import {guard} from "../../../../helper/Auth";
import {IInfinityPriceMaster} from "./infinity-price-master.types";
import InfinityPriceMasterBusiness from "./infinity-price-master.business";
import {InfinityPriceMasterValidation} from "./infinity-price-master.validation";
import XLSX from "xlsx";
import {skuColorTypeEnum} from "../../../sku/sku.types";
import caratMasterModel from "../carat-master/carat-master.model";
import clarityMasterModel from "../clarity-master/clarity-master.model";
import colorMasterModel from "../color-master/color-master.model";
import infinityPriceMasterModel from "./infinty-price-master.model";
import {Messages} from "../../../../constants";
import {InfinityPriceRepository} from "../../infinity-price.repository";
import {InfinityPriceMasterRepository} from "./infinity-price-master.repository";

export class InfinityPriceMasterController extends BaseController<IInfinityPriceMaster> {
    constructor() {
        super(new InfinityPriceMasterBusiness(), "infinity-price-master", true);
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/infinity-price-master',guard, this.router)

    init() {
        const validation: InfinityPriceMasterValidation = new InfinityPriceMasterValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/" , validation.add, TryCatch.tryCatchGlobe(this.createBC));
        this.router.post("/import-infinity-price-master", Upload.uploadFile('/uploads/excels').single("file"), guard, TryCatch.tryCatchGlobe(this.importInfinityPriceMaster));
        // this.router.put("/" , validation.updatecaratMaster, TryCatch.tryCatchGlobe(this.update));
        // this.router.delete("/", guard, TryCatch.tryCatchGlobe(this.deleteBC));
        // this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        // this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new InfinityPriceMasterRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async importInfinityPriceMaster(req: Request, res: Response){   //Todo main logic to repo file.
        const {body:{loggedInUser:{_id:loggedInUserId}}} = req as any
        if(!req?.file?.path) throw new Error('Invalid File.')
        //@ts-expect-error
        let file: any = await new XLSX.readFile(req?.file?.path);
        const sheets: string[] = file.SheetNames
        let limit: number = 0, data: any[] = [], clarityObject: any = {}, colorObject: any = {}
        let clarity: string, color: string, minWeight: number, maxWeight: number, maxWeightToFind: number[] = []
        let colorToFind: string[] = [], clarityToFind: string[] = [], minWeightToFind: number[] = []
        if(sheets.find(color => color.toUpperCase()==skuColorTypeEnum.WHITE)){
            limit = Number(file.Sheets.White['!ref'].split(':')[1].slice(1));
            minWeight = file.Sheets.White.A1.v;
            maxWeight = file.Sheets.White.B1.v;
            clarity = file.Sheets.White.C1.v;
            color = file.Sheets.White.D1.v;
            for(let i = 2; i <= limit; i++) {
                data.push({
                    [minWeight]: file.Sheets.White[`A${i}`].v, [maxWeight]: file.Sheets.White[`B${i}`].v,
                    [clarity]: file.Sheets.White[`C${i}`].v, [color]: file.Sheets.White[`D${i}`].v,
                    createdBy: loggedInUserId, updatedBy: loggedInUserId
                })
                minWeightToFind.push(file.Sheets.White[`A${i}`].v)
                maxWeightToFind.push(file.Sheets.White[`B${i}`].v)
                clarityToFind.push(file.Sheets.White[`C${i}`].v)
                colorToFind.push(file.Sheets.White[`D${i}`].v)
            }
            minWeightToFind = [...new Set(minWeightToFind)]
            maxWeightToFind = [...new Set(maxWeightToFind)]
            clarityToFind = [...new Set(clarityToFind)]
            colorToFind = [...new Set(colorToFind)]

            let [weightData, clarityData, colorData] = await Promise.all([
                await caratMasterModel.find({isDeleted: false, fromCarat: {$in: minWeightToFind}, toCarat: {$in: maxWeightToFind}}).select('fromCarat toCarat').lean(),
                await clarityMasterModel.find({isDeleted: false, clarity: {$in: clarityToFind}}).select('clarity').lean(),
                await colorMasterModel.find({isDeleted: false, color: {$in: colorToFind}}).select('color').lean()
            ])

            await clarityData.forEach(clarity => clarityObject[clarity.clarity] = clarity)
            await colorData.forEach(color => colorObject[color.color] = color)

            data.forEach(dd => {
                weightData.forEach(weight => {
                    if(dd[minWeight] == weight.fromCarat && dd[maxWeight] == weight.toCarat) dd['caratRangeMasterId'] = weight._id
                })
                dd['clarityMasterId'] = clarityObject[dd[clarity]]._id
                dd['colorMasterId'] = colorObject[dd[color]]._id
            })

            await infinityPriceMasterModel.insertMany(data)
        }
        else throw new Error('No White Sheet found in Excel.')
        res.locals.message = Messages.SUCCESSFULLY_FILE_IMPORTED;
        await JsonResponse.jsonSuccess(req, res, "email");
    }
}