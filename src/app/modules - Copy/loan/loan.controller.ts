import {BaseController} from "../BaseController";
import {Application, Request, Response, Handler} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {ILoan} from "./loan.types";
import LoanBusiness from "./loan.business";
import {LoanValidationValidation} from "./loan.validation";
import {LoanRepository} from "./loan.repository";
import {Messages} from "../../constants";
import {Types} from "mongoose";
import {UserRepository} from "../user/user.repository";
import {CompanyClientSettingRepository} from "../companyClientSetting/companyClientSetting.repository";
import {MongooseTransaction} from "../../helper/MongooseTransactions";


export class LoanController extends BaseController<ILoan> {
    constructor() {
        super(new LoanBusiness(), "loan", true);
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/loan', guard, this.router)

    init() {
        const validation: LoanValidationValidation = new LoanValidationValidation();
        // this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/", TryCatch.tryCatchGlobe(this.index));
        this.router.get("/detail", TryCatch.tryCatchGlobe(this.detail));
        this.router.get("/get-collateral-by-companyId", TryCatch.tryCatchGlobe(this.getByCollateral));
        this.router.get("/summary", TryCatch.tryCatchGlobe(this.summary));
        this.router.post("/", validation.add, MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.add));
        this.router.put("/", validation.edit, MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.edit));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.get("/get-collaterals", TryCatch.tryCatchGlobe(this.getCollateral));
        // this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        // this.router.post("/get-prices", /*validation.getPrices,*/ TryCatch.tryCatchGlobe(this.getPrices));//Todo fix validation

        // this.router.get("/fetch", TryCatch.tryCatchGlobe(this.fetch));
        this.router.get("/summary/filterCriteria", /*validation.filterCriteria,*/ TryCatch.tryCatchGlobe(this.filter));
    }

    async summary(req: Request, res: Response) {
        const data = await new LoanRepository().summary(req.query as any)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, "getByCompanyId");
    }

    detail = async (req: Request, res: Response) => {
        const {data, page, header}: any = await new LoanRepository().detail(req.query as any)
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, "detail");
    }

    getCollateral: Handler = async (req, res) => {
        const data: any = await new LoanRepository().getByCollateral(req?.query?.companyId as any)
        res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, "detail");
    }


    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new LoanRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    add: Handler = async (req, res) => {
        const {mongoSessionNew: mongoSession, body, body: {loggedInUser:{_id: loggedInUserId}}} = req as any
        let data: any;
        await mongoSession.withTransaction(async() => data = await new LoanRepository().add(body, loggedInUserId, mongoSession))
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, "add");
    }

    edit: Handler = async (req, res) => {
        const {mongoSessionNew: mongoSession, body, body: {loggedInUser:{_id: loggedInUserId}}} = req as any
        let data: any;
        mongoSession.withTransaction(async() => data = await new LoanRepository().edit(body, loggedInUserId, mongoSession))
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, "edit");
    }

    getByCollateral: Handler = async (req, res) => {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        // if(!req?.query?.companyId) throw new Error('Invalid companyId')
        const data = await new LoanRepository().getByCollateral(req?.query?.companyId as any)
        res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.getByCollateral`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new LoanRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

    // async getPrices(req: Request, res: Response) {
    //     const RapPriceBusinessInstance = new LoanBusiness()
    //     const {body} = req
    //     let rapPriceQuery: any[] = []
    //     let rapPriceData: any[] = []
    //     rapPriceQuery = body.map(async({weight, color, shape, clarity, reportNumber}:any) => {
    //         if(weight > 5) weight = 5.00;
    //         if (shape !== 'Round') shape = 'Pear';
    //         await RapPriceBusinessInstance.aggregateBB([
    //             {'$match': {'weightRange.fromWeight': {'$lte': weight}, 'weightRange.toWeight': {'$gte': weight}, shape, clarity, color}},
    //             {'$sort': {'_id': -1}}, {'$limit': 1}])
    //         .then(data => rapPriceData.push({reportNumber, _id: data[0]?._id || null, price: data[0]?.price || 0}))
    //     })
    //     await Promise.all(rapPriceQuery)
    //     res.locals.data = rapPriceData;
    //     res.locals.message = "Rap Price Fetch Successful";
    //     await JsonResponse.jsonSuccess(req, res, "email");
    // }
}
