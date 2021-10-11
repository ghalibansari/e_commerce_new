import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {DiamondMatchRuleValidation} from "./diamond-match-rule.validation"
import {guard} from "../../helper/Auth";
import DiamondMatchRuleBusiness from "./diamond-match-rule.business"
import {IDiamondMatchRule} from "./diamond-match-rule.types";
import CompanyBusiness from "../company/company.business"
import {Messages} from "../../constants";
import {UserRepository} from "../user/user.repository";
import {DiamondMatchRuleRepository} from "./diamond-match-rule.repository";

export class DiamondMatchRuleController extends BaseController<IDiamondMatchRule> {
    constructor() {
        super(new DiamondMatchRuleBusiness(), "diamond-match-rule", true, new DiamondMatchRuleRepository());
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/diamond-match-rule', guard, this.router);
    }

    init() {   //Todo write validation
        const validation: DiamondMatchRuleValidation = new DiamondMatchRuleValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.createDiamondMatchRule, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/", validation.updateDiamondMatchRule, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new DiamondMatchRuleRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async create(req: Request, res: Response): Promise<void> {
        let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        await new CompanyBusiness().findOneBB({_id: body.companyId}).then(company => {if(!company?._id) throw new Error("Invalid companyId") })
        res.locals.data = await new DiamondMatchRuleBusiness().createBB(body);
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async update(req: Request, res: Response): Promise<void> {
        let { body, body: { _id }, body: { loggedInUser: { _id: loggedInUserId } } } = req
        body.updatedBy = loggedInUserId
        if (body.companyId) await new CompanyBusiness().findOneBB({_id: body.companyId}).then(company => {if(!company?._id) throw new Error("Invalid companyId") })
        const data = await new DiamondMatchRuleBusiness().findAndUpdateBB({_id}, body)
        if(data) { res.locals.data = 1; res.locals.message = Messages.UPDATE_SUCCESSFUL}
        else { res.locals.data = 0; res.locals.message = Messages.UPDATE_FAILED}        
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

}