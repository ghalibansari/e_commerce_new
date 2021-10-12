import { BaseController } from "../BaseController"
import { Application, Request, Response } from "express";
import { TryCatch, JsonResponse } from "../../helper";
import { guard } from "../../helper/Auth"
import { Messages, Constant } from "../../constants";
import { IBusiness } from "./business.types"
import BusinessBusiness from "./business.business"
import { CreateBusinessValidation } from "./business.validation";
import { BusinessRepository } from "./business.repository";
import { TransactionRepository } from "../transaction/transaction.repository";
import { MongooseTransaction } from "../../helper/MongooseTransactions";


export class BusinessController extends BaseController<IBusiness> {
    constructor() {
        super(new BusinessBusiness(), "business", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/business', guard, this.router);
    }

    init() {
        const validation: CreateBusinessValidation = new CreateBusinessValidation();
        this.router.post("/", MongooseTransaction.startTransactionNew, validation.createBusiness, TryCatch.tryCatchGlobe(this.create))
        this.router.get('/index',TryCatch.tryCatchGlobe(this.index))
        this.router.get("/detail", validation.detail, TryCatch.tryCatchGlobe(this.findReview))
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
        this.router.get("/status", TryCatch.tryCatchGlobe(this.getStatus))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {data, page}: any = await new BusinessRepository().index(req.query)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    create = async (req: Request, res: Response): Promise<void> => {
        let { mongoSessionNew: mongoSession, body: { action, companyId, comments, loggedInUser: { _id: loggedInUserId, roleName } } } = req as any;
        let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
        // let data
        if(action === "OPEN")  res.locals = await new BusinessRepository().openBusiness(companyId, user, mongoSession)
        if(action === "CLOSE")  res.locals = await new BusinessRepository().closeBusiness(companyId, comments, user)
        // res.locals = {messa}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new BusinessRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

    async findReview(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        //@ts-expect-error
        req.query.transactionData = await new BusinessRepository().findOneBR({_id: req?.query?._id});
        const {data, header, page}: any = await new TransactionRepository().findReviewBR(req.query as any)
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    getStatus = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        console.log(req?.body?.loggedInUser.companyId)
        const data = await new BusinessRepository().getStatus(req?.body?.loggedInUser.companyId as any)
        res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);

    }
}
