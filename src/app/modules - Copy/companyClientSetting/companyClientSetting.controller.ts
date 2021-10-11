import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {Messages} from "../../constants"
import {guard} from "../../helper/Auth";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {ICompanyClientSetting} from "./companyClientSetting.types";
import CompanyClientSettingBusiness from "./companyClientSetting.business";
import {CompanyClientSettingRepository} from "./companyClientSetting.repository";
import {CompanyClientSettingValidation} from "./companyClientSetting.validation";


export class CompanyClientSettingController extends BaseController<ICompanyClientSetting> {
    constructor() {
        super(new CompanyClientSettingBusiness(), "company-client-setting", true, new CompanyClientSettingRepository());
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/company-client-setting', guard, this.router)

    init() {
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: CompanyClientSettingValidation = new CompanyClientSettingValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.index));
        this.router.put("/", validation.updateDiamondMatchSetting, TryCatch.tryCatchGlobe(this.update));
        this.router.put("/bulk", validation.bulkUpdateDiamondMatchSetting, transaction.startTransaction, TryCatch.tryCatchGlobe(this.bulkUpdate));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new CompanyClientSettingRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async update(req: Request, res: Response){
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        const {body, body:{companyId, loggedInUser:{_id:loggedInUserId}}} = req
        body.updatedBy = loggedInUserId
        const data = await new CompanyClientSettingRepository().update({companyId}, body)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `update`);
    }

    async bulkUpdate(req: Request, res: Response){
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        const {mongoSession, body:{newData, loggedInUser:{_id:loggedInUserId}}} = req as any
        newData.forEach((data:any) => data.updatedBy = loggedInUserId)
        const data = await new CompanyClientSettingRepository().bulkUpdate(newData, loggedInUserId, mongoSession)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `update`);
    }
}