import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {ISkuInfinityPrice} from "./sku-infinity-price.types";
import SkuInfinityPriceBusiness from "./sku-infinity-price.business";
import {SkuInfinityPriceValidation} from "./sku-infinity-price.validation";
import {SkuInfinityPriceRepository} from "./sku-infinity-price.repository";
import {Messages} from "../../constants";


export class SkuInfinityPriceController extends BaseController<ISkuInfinityPrice> {
    constructor() {
        super(new SkuInfinityPriceBusiness(), 'loan-history', true);
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/loan-history', guard, this.router)

    init() {
        const validation: SkuInfinityPriceValidation = new SkuInfinityPriceValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.index));
        // this.router.post("/", validation.createLoan, TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", validation.updateUser, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new SkuInfinityPriceRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }
}
