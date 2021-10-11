import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import TransitBusiness from "./transit.business";
import {Messages} from "../../constants";
import {TransitValidation} from "./transit.validation";
import {IComment} from "../comment/comment.types";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {RequestWithTransaction} from "../../interfaces/Request";
import {TransitRepository} from "./transit.repository";
import { TransactionRepository } from "../transaction/transaction.repository";


export class TransitController extends BaseController<any> {
    constructor() {
        super(new TransitBusiness(), "transit", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/transit', guard, this.router);
    }

    init() {
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: TransitValidation = new TransitValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/",validation.createTransit, transaction.startTransaction, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/", validation.updateTransit, transaction.startTransaction, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.get("/detail", TryCatch.tryCatchGlobe(this.findReview))
        this.router.get("/detail/filterCriteria", validation.filterCriteria, TryCatch.tryCatchGlobe(this.filterReview))
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new TransitRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    // async create(req: Request, res: Response): Promise<void|never> {
    //     let {body,mongoSession, body:{ loggedInUser:{_id:loggedInUserId}} } = req as RequestWithTransaction;        
    //     body.createdBy = body.updatedBy = loggedInUserId
    //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
    //     let transactionBusinessInstance = new TransactionRepository()
    //     let transactionId = "TR-" + new Date().toISOString()
    //     let transactionBody : any = {transactionId, "transactionType": "Transit", status: "Pending", ...user}
    //     let transaction: any = await transactionBusinessInstance.createBR(transactionBody, mongoSession)
    //     body.comments.forEach((comment: IComment) => comment.createdBy = loggedInUserId)
    //     await new TransitController().checkIds(body, mongoSession);
    //     transaction.status = "Completed", transaction.skuIds = body.skuIds
    //     await transactionBusinessInstance.updateManyBR({transactionId},transaction, mongoSession)
    //     res.locals.data = await new TransitRepository().createBR(body, mongoSession);
    //     res.locals.message = Messages.CREATE_SUCCESSFUL;
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    // }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let { body, mongoSession, body: { loggedInUser: { _id: loggedInUserId } } } = req as RequestWithTransaction;
        body.createdBy = body.updatedBy = loggedInUserId
        let user = { createdBy: loggedInUserId, updatedBy: loggedInUserId }
        let transactionId = "TR-" + new Date().toISOString()
        let transactionBody: any = { transactionId, ...user }
        if(body.comments) body.comments.forEach((comment: IComment) => comment.createdBy = loggedInUserId)
        let data = await new TransitRepository().create(body, transactionBody, user, mongoSession)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    }

    // async update(req: Request, res: Response): Promise<void> {
    //     let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}, mongoSession} = req as RequestWithTransaction;
    //     await new TransitController().checkIds(body, mongoSession);
    //     body.updatedBy = loggedInUserId
    //     body.comments.forEach((comment: any) => comment.createdBy = loggedInUserId)
    //     let data = await new TransactionRepository().findAndUpdateBR(_id, body,{}, mongoSession);
    //     if(data) {res.locals.data = data; res.locals.message = Messages.UPDATE_SUCCESSFUL;}
    //     else {res.locals.data = data; res.locals.message = Messages.UPDATE_FAILED;}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    // }

    async update(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.UPDATE_FAILED };
        let { body, body: { _id, loggedInUser: { _id: loggedInUserId } }, mongoSession } = req as RequestWithTransaction;
        body.updatedBy = loggedInUserId
        body.comments.forEach((comment: IComment) => comment.createdBy = loggedInUserId)
        let data = await new TransitRepository().update(body, mongoSession);
        res.locals = { status: true, message: Messages.UPDATE_SUCCESSFUL, data }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    // async checkIds({skuIds}: ITransit, mongoSession:any): Promise<void|never> {
    //     let SkuBusinessInstance = new SkuRepository()
    //     // let AddressBusinessInstance = new AddressBusiness()
    //     let skuIdData = skuIds.map( id =>  SkuBusinessInstance.findIdByIdBR(id));        
    //     await Promise.all(skuIdData).then(skuIdData => skuIdData.forEach(sku => {if(!sku?._id) throw new Error("Invalid skuId")}) )        
    //     // let [toData, fromData, statusIdData] = await Promise.all([AddressBusinessInstance.findOneByIdBB({_id: to}), AddressBusinessInstance.findOneByIdBB({_id: from}), new StatusBusiness().findOneByIdBB({_id: statusId})])
    //     // if(!toData?._id) throw new Error("Invalid to addressId")
    //     // if(!fromData?._id) throw new Error("Invalid from addressId")
    //     // if(!statusIdData?._id) throw new Error("Invalid statusId")
    //     //@ts-expect-error
    //     await SkuBusinessInstance.updateManyBR({"_id": skuIds},{ movementStatus :"TRANSIT"}, mongoSession)
    // }

    async find(req: Request, res: Response){
        let populate = [{path: 'skuIds'}];
        await new TransitController().findBC(req, res, populate)
    }

    async findReview(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        //@ts-expect-error
        req.query.transactionData = await new TransitRepository().findOneBR({_id: req?.query?.transitId});
        const {data, header, page}: any = await new TransactionRepository().findReviewBR(req.query as any)
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async filterReview(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let transitData = await new TransitRepository().findOneBR({_id: req?.query?.transitId});
        //@ts-expect-error
        let data = await new TransactionRepository().filterBR(transitData?.skuIds)
        if (data) {
            data.labs = [].concat.apply([], data.labs);
            data.labs = [...new Set(data.labs.map((labData: any) => labData.lab))]
            data.weight = { max: Math.max(...data.uniqueWeight), min: Math.min(...data.uniqueWeight), values: data.uniqueWeight.sort((n1: number, n2: number) => n1 - n2) }
            data.iav = { max: Math.max(...data.uniqueIav), min: Math.min(...data.uniqueIav), values: data.uniqueIav.sort((n1: number, n2: number) => n1 - n2) }
            data.pwv = { max: Math.max(...data.uniquePwv), min: Math.min(...data.uniquePwv), values: data.uniquePwv.sort((n1: number, n2: number) => n1 - n2) }
            data.drv = { max: Math.max(...data.uniqueDrv), min: Math.min(...data.uniqueDrv), values: data.uniqueDrv.sort((n1: number, n2: number) => n1 - n2) }
            let rapPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueRapPrices.sort((n1: number, n2: number) => n1 - n2) }
            data.price = { rapPrice }
            let clientPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueClientPrices.sort((n1: number, n2: number) => n1 - n2) }
            data.price = { ...data.price, clientPrice }
            data.dmStatus = ["MATCHED", "NOTMATCHED"]
            delete data.uniqueWeight
            delete data.uniqueIav
            delete data.uniquePwv
            delete data.uniqueDrv
            delete data.uniqueClientPrices
            delete data.uniqueRapPrices
        }
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findReview`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new TransitRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}