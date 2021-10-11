import {BaseController} from "../BaseController";
import {JsonResponse, TryCatch} from "../../helper";
import {Application, Request, Response} from "express";
import {guard} from "../../helper/Auth";
import InfinityPriceBusiness from "./infinity-price.business";
import { InfinityPriceRepository } from "./infinity-price.repository";
import { Messages } from "../../constants";
import {IInfinityPrice} from "./infinity-price.types";
import { RequestWithTransaction } from "../../interfaces/Request";
import infinityPriceModel from "./infinity-price.model";
import { MongooseTransaction } from "../../helper/MongooseTransactions";
import { InfinityPriceValidation } from "./infinity-price.validation";
import rapPriceModel from "../rap-price/rap-price.model";


export class InfinityPriceController extends BaseController<IInfinityPrice> {
    constructor() {
        super(new InfinityPriceBusiness(), "infinity-price");
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/infinity-price', guard, this.router);

    init() {   //Todo write validation
        const validation: InfinityPriceValidation = new InfinityPriceValidation()
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.get("/combination-white/index", TryCatch.tryCatchGlobe(this.combinationArrayIndexWhite));
        this.router.get("/combination-fancy/index", validation.combinationArrayFancyIndex, TryCatch.tryCatchGlobe(this.combinationArrayIndexFancy));
        this.router.get("/combination", TryCatch.tryCatchGlobe(this.combinationArray))
        this.router.post("/", validation.createInfinityPrice, MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.create));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new InfinityPriceRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async combinationArrayIndexWhite(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new InfinityPriceRepository().combinationArrayIndexWhite(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async combinationArrayIndexFancy(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new InfinityPriceRepository().combinationArrayIndexFancy(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED};
        let {body, mongoSessionNew: mongoSession, body:{infinityPriceData, loggedInUser:{_id:loggedInUserId, companyId}}} = req as any
        infinityPriceData.forEach((element: IInfinityPrice) => element.createdBy = element.updatedBy = loggedInUserId);
        const data = await new InfinityPriceRepository().create(infinityPriceData, mongoSession)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new InfinityPriceRepository().filter(loggedInUserId)
        if (data) {
            data.price = { max: Math.max(...data.prices), min: Math.min(...data.prices), values: data.prices.sort((n1: number, n2: number) => n1 - n2) };    
        }
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

    async combinationArray(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req;
        let data = await new InfinityPriceRepository().combinationArray()
        let combinationData = await new InfinityPriceRepository().combination(data)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data: combinationData}
        // res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data: data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.combinationArray`);
    }

}