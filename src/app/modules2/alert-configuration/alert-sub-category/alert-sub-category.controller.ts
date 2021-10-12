import {BaseController} from "../../BaseController";
import {Application, Handler, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../../helper";
import {guard} from "../../../helper/Auth";
import { IAlertSubCategory } from "./alert-sub-category.types";
import { AlertSubCategoryValidation } from "./alert-sub-category.validation";
import { AlertSubCategoryRepository } from "./alert-sub-category.repository";
import { Messages } from "../../../constants";
import AlertSubCategoryBusiness from "./alert-sub-category.business";

export class AlertSubCategoryController extends BaseController<IAlertSubCategory> {
    constructor() {
        super(new AlertSubCategoryBusiness(), "alert-sub-category", true, new AlertSubCategoryRepository());
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/alert-sub-category',guard, this.router)

    init() {
        const validation: AlertSubCategoryValidation = new AlertSubCategoryValidation();
        this.router.get("/",  TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.createSubAlertCategory, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/", validation.edit, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", guard, TryCatch.tryCatchGlobe(this.deleteBC));   // delete is not required in this module
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))

        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const {data, page}: any = await new AlertSubCategoryRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    create: Handler = async (req, res) => {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{ loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        const data = await new AlertSubCategoryRepository().create(body)
        res.locals = {status: true, data, message: Messages.CREATE_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new AlertSubCategoryRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}