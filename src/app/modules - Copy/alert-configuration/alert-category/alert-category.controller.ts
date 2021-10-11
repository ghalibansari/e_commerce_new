import {BaseController} from "../../BaseController";
import {Application, Handler, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../helper";
import {guard} from "../../../helper/Auth";
// import {AlertMasterValidation} from "./alert-master.validation"
import { IAlertCategory } from "./alert-category.types";
import AlertCategoryBusiness from "./alert-category.business";
import { AlertCategoryValidation } from "./alert-category.validation";
import { AlertCategoryRepository } from "./alert-category.repository";
import { Messages } from "../../../constants";
import { MongooseTransaction } from "../../../helper/MongooseTransactions";

export class AlertCategoryController extends BaseController<IAlertCategory> {
    constructor() {
        super(new AlertCategoryBusiness(), "alert-category", true);
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/alert-category',guard, this.router)

    init() {
        const validation: AlertCategoryValidation = new AlertCategoryValidation()
        this.router.get("/",  TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.createAlertCategory, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.edit, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.delete))
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))

        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const {data, page}: any = await new AlertCategoryRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    delete: Handler = async (req, res) => {
        res.locals = {status: false, message: Messages.FAILED};   //Todo use generic failed msg every where in fallback value.
        const {body, mongoSessionNew: session, body: {loggedInUser: {_id: loggedInUserId}}} = req as any
        let R: any = {}
        await session.withTransaction(async() => R = await new AlertCategoryRepository().delete(req.query?._id as any, loggedInUserId, session))
        if(R) res.locals = {status: true, data: 1, message: Messages.DELETE_SUCCESSFUL}
        else res.locals = {status: false, data: 0, message: Messages.FAILED};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.delete`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new AlertCategoryRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}