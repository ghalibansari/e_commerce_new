import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {CompanyTypeValidation} from "./company-type.validation"
import {guard} from "../../helper/Auth";
import CompanyTypeBusiness from "./company-type.business";
import {ICompanyType} from "./company-type.types";
import { CompanyTypeRepository } from "./company-type.repository";
import { Messages } from "../../constants";

export class CompanyTypeController extends BaseController<ICompanyType> {
    constructor() {
        super(new CompanyTypeBusiness(), "company-type", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/company-type', guard, this.router);
    }

    init() {   //Todo write validation
        const validation: CompanyTypeValidation = new CompanyTypeValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/",validation.createCompanyType , TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/",validation.updateCompanyType, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.delete));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const {data, page}: any = await new CompanyTypeRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    delete = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.DELETE_FAILED}
        let { query: {_id: companyTypeId}, body:{ loggedInUser:{_id:loggedInUserId}}} = req
        const data = await new CompanyTypeRepository().delete(companyTypeId as any, loggedInUserId)
        res.locals = {status: true, message: Messages.DELETE_SUCCESSFUL, data: 1}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        let {body: {loggedInUser: {_id: loggedInUserId}}} = req
        let data = await new CompanyTypeRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}