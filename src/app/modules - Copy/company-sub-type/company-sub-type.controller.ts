import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {CompanySubTypeValidation} from "./company-sub-type.validation"
import {guard} from "../../helper/Auth";
import CompanySubTypeBusiness from "./company-sub-type.business"
import {ICompanySubType} from "./company-sub-type.types";
import CompanyTypeBusiness from "../company-type/company-type.business"
import {Messages} from "../../constants";
import { Object } from "lodash";
import { ICompanyType } from "../company-type/company-type.types";
import { CompanySubTypeRepository } from "./company-sub-type.repository";


export class CompanySubTypeController extends BaseController<ICompanySubType> {
    constructor() {
        super(new CompanySubTypeBusiness(), "company-sub-type", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/company-sub-type', guard, this.router);
    }

    init() {
        const validation: CompanySubTypeValidation = new CompanySubTypeValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.createCompanySubType, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/", validation.updateCompanySubType, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.delete));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const {data, page}: any = await new CompanySubTypeRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    async create(req: Request, res: Response): Promise<void> {
        //@ts-expect-error
        let {body, body:{companyTypeId, loggedInUser:{_id:loggedInUserId}}} : {body:ICompanySubType} = req
        body.createdBy = body.updatedBy = loggedInUserId
        await new CompanyTypeBusiness().findOneBB({_id: companyTypeId}).then(companyType => {if(!companyType?._id) throw new Error("Invalid CompanyTypeId")})
        res.locals.data = await new CompanySubTypeBusiness().createBB(body)
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async update(req: Request, res: Response): Promise<void> {
        //@ts-expect-error
        let {body, body:{_id, companyTypeId}, body:{loggedInUser:{_id:loggedInUserId}}} : {body:ICompanySubType} = req
        body.updatedBy = loggedInUserId
        if (companyTypeId) await new CompanyTypeBusiness().findOneBB({_id: companyTypeId}).then(companyType => {if (!companyType?._id) throw new Error("Invalid companyTypeId") })
        const data = await new CompanySubTypeBusiness().findAndUpdateBB({_id}, body);
        if(data) {res.locals.data = data; res.locals.message = Messages.UPDATE_SUCCESSFUL;}
        else {res.locals.data = data; res.locals.message = Messages.UPDATE_FAILED;}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    delete = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.DELETE_FAILED}
        let { query: {_id: companySubTypeId}, body:{ loggedInUser:{_id:loggedInUserId}}} = req
        const data = await new CompanySubTypeRepository().delete(companySubTypeId as any, loggedInUserId)
        res.locals = {status: true, message: Messages.DELETE_SUCCESSFUL, data: 1}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        let {body: {loggedInUser: {_id: loggedInUserId}}} = req
        let data = await new CompanySubTypeRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}
