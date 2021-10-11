import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {Messages} from "../../constants"
import {ActivityHistoryRepository} from "./activity-history.repository";
import {IActivityHistory} from "./activity-history.types";
import ActivityHistoryBusiness from "./activity-history.business";
import mongoose, {startSession} from "mongoose";

//import * as ExcelJS from 'exceljs/dist/exceljs.min.js';

export class ActivityHistoryController extends BaseController<IActivityHistory> {
    constructor() {
        super(new ActivityHistoryBusiness(), "activity-history", true, new ActivityHistoryRepository());
        this.init();
    }

    register(express: Application): void {
        express.use('/api/v1/activity-history', guard, this.router);
    }

    init(): void {   //Todo write validation
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        // this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.get("/move-to-history", TryCatch.tryCatchGlobe(this.move));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        let {data, page}: any = await new ActivityHistoryRepository().index(req.query)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }
    
    async find(req: Request, res: Response): Promise<void> {
        let populate = [{path: "skuId"},{path: "userId", select: '-password'},{path: "companyId"},{path: "labsId"},{path: "dmId"},{path:'iavId',populate:
                [{path: 'rapPriceId', model: 'RapPrice'}, {path: 'clientPriceId', model: 'ClientPrice'}] }, {path: 'createdBy'}, {path: 'updatedBy'}]
        await new ActivityHistoryController().findBC(req, res, populate)
    }

    async move(req: Request, res: Response): Promise<void> {
        let {query:{days}} = req
        const mongoSession = await startSession()
        mongoSession.startTransaction();
        //@ts-expect-error
        req.mongoSession = mongoSession
        //@ts-expect-error
        let data = await new ActivityHistoryRepository().activityHistory(days, mongoSession)
        res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }
}