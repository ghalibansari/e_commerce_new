import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import AlertBusiness from "./alert.business";
import {IAlert} from "./alert.types";
import UserBusiness from "../user/user.business";
import AlertMasterBusiness from "../alert-master/alert-master.business";
import {Messages, Texts} from "../../constants";
import {AlertValidation} from "./alert.validation"
import CompanyBusiness from "../company/company.business";
import {AlertRepository} from "./alert.repository";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {CompanyRepository} from "../company/company.repository";
import {IIndexParam} from "../../interfaces/IRepository";
import {ICounter} from "../baseTypes";

export class AlertController extends BaseController<IAlert> {
    constructor() {
        super(new AlertBusiness(), "alert", true, new AlertRepository(), []);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/alert', guard, this.router);
    }

    init() {
        const validation: AlertValidation = new AlertValidation();
        const transaction: MongooseTransaction = new MongooseTransaction();
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/",validation.createAlert, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/",validation.updateAlert, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));   // delete is not required in this module
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
        this.router.get("/count", TryCatch.tryCatchGlobe(this.counterBC));
        this.router.get("/count-by-sku-companyId", validation.countBySkuCompanyId, TryCatch.tryCatchGlobe(this.countBySkuCompanyId));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        if(req?.body?.loggedInUser?.roleName !== Texts.SPACECODEADMIN){
            //@ts-expect-error
            let filters: {}[] = JSON.parse(req.query.filters);
            filters.forEach((data:any, i) => {if (data.key === Texts.companyId) data.key = Texts.skuId_companyId})
            req.query.filters = JSON.stringify(filters);
        }
        const {data, page}: any = await new AlertRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        const data = await new AlertRepository().create(body)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async countBySkuCompanyId(req: Request, res: Response): Promise<void> { //Todo create validation companyId required.
        res.locals = { status: false, message: Messages.FETCH_FAILED}   //Todo fix this later temp api and make it permanent
        if(req?.body?.loggedInUser?.roleName !== Texts.SPACECODEADMIN) req.query.companyId = req?.body?.loggedInUser?.companyId
        const {query:{count, companyId}} = req
        let counter: string|ICounter[] = count as string
        if(counter?.length && counter[0] === '[' && counter[counter.length-1] === ']') {
            counter = counter.replace(/'/g, '"');
            counter = await JSON.parse(counter) as ICounter[]
            //@ts-expect-error
            const data = await new AlertRepository().countBySkuCompanyId(req.query, counter, companyId)
            res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
        }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.counterBC`)
    }

    async update(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.updatedBy = loggedInUserId
        const data = await new AlertRepository().update(body);
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    async checkIds(body:IAlert): Promise<void|never> {
        
        let [userIdData, alertIdData, companyIdData] = await Promise.all([
            new UserBusiness().findIdByIdBB(body.userId),
            new AlertMasterBusiness().findOneBB({_id: body.alertId}),
            new CompanyBusiness().findIdByIdBB(body.companyId)
        ])        
        if(!alertIdData?._id) throw new Error("Invalid alertId")
        if(alertIdData.alertType === "USERGENERATED" && !userIdData?._id) {
            if(!body.userId) throw new Error("userId is required") 
            else throw new Error("Invalid userId")
        }
        if(alertIdData.alertType === "SYSTEMGENERATED" &&  !companyIdData?._id){
            if(!body.companyId) throw new Error("companyId is required") 
            else throw new Error("Invalid companyId")
        }
    }

    async find(req: Request, res: Response): Promise<void> {
        let populate = [{path: "alertId"},{path: "userId", select: '-password'},{path: "companyId"}]
        await new AlertController().findBC(req, res, populate)
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req;
        let data = await new AlertRepository().filter(loggedInUserId);
        if (data) {
            data.labs = [].concat.apply([], data.labs);
            data.labs = [...new Set(data.labs.map((labData: any) => labData.lab))];
            data.weight = { max: Math.max(...data.uniqueWeight), min: Math.min(...data.uniqueWeight), values: data.uniqueWeight.sort((n1: number, n2: number) => n1 - n2) };
            data.iav = { max: Math.max(...data.uniqueIav), min: Math.min(...data.uniqueIav), values: data.uniqueIav.sort((n1: number, n2: number) => n1 - n2) };
            data.pwv = { max: Math.max(...data.uniquePwv), min: Math.min(...data.uniquePwv), values: data.uniquePwv.sort((n1: number, n2: number) => n1 - n2) };
            data.drv = { max: Math.max(...data.uniqueDrv), min: Math.min(...data.uniqueDrv), values: data.uniqueDrv.sort((n1: number, n2: number) => n1 - n2) };
            let rapPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueRapPrices.sort((n1: number, n2: number) => n1 - n2) };
            data.price = { rapPrice };
            let clientPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueClientPrices.sort((n1: number, n2: number) => n1 - n2) };
            data.price = { ...data.price, clientPrice };
            data.company.sort((a: any, b: any) => {return  (a.sorted).localeCompare(b.sorted);});
            data.dmStatus = ["MATCHED", "NOTMATCHED"];
            delete data.uniqueWeight;
            delete data.uniqueIav;
            delete data.uniquePwv;
            delete data.uniqueDrv;
            delete data.uniqueClientPrices;
            delete data.uniqueRapPrices
        }
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}