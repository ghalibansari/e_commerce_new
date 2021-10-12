import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {UserValidation} from "../user/user.validation"
import {guard} from "../../helper/Auth";
import {Messages} from "../../constants";
import {IComment} from "../comment/comment.types";
import RfidBusiness from "./rfid.business";
import {IRfid} from "./rfid.types";
import {RfidValidation} from "./rfid.validation";
import mongoose, {ClientSession} from "mongoose";
import {IIndexProjection} from "../../interfaces/IRepository";
import { RfidRepository } from "./rfid.repository";
import { Projection } from "../../constants/projection";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {RequestWithTransaction} from "../../interfaces/Request";


export class RfidController extends BaseController<IRfid> {
    constructor() {
        super(new RfidBusiness(), "rfid");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/rfid', guard, this.router);
    }

    init() {   //Todo write validation
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: RfidValidation = new RfidValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/mapping", transaction.startTransaction, TryCatch.tryCatchGlobe(this.rfidMapping));   //Todo write validation for this...
        this.router.post("/", validation.createRfid, TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", validation.createRfid, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.get("/get-by-sku", validation.getBySku, TryCatch.tryCatchGlobe(this.getBySku))
        this.router.put("/", transaction.startTransaction, TryCatch.tryCatchGlobe(this.update))
    }

    async getBySku(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        // let projection: IIndexProjection = {'createdBy.password': 0, 'createdBy.fingerPrint': 0, 'createdBy.badgeId': 0,
        // 'createdBy.addressId':0, 'createdBy.createdBy':0, 'createdBy.updatedBy': 0, 'createdBy.createdAt':0, 'createdBy.updatedAt':0, 'createdBy.isActive':0,
        // 'createdBy.isDeleted':0, 'createdBy.email': 0, 'createdBy.phone': 0, 'createdBy.altEmail':0, 'createdBy.roleId':0, 'createdBy.companyId':0,
        // 'createdBy.salt':0, 'createdBy.__v':0}

        let aggregateCond = [
            {$match : {skuId: mongoose.Types.ObjectId(req.query.skuId as string), isDeleted: false}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$project: Projection.createdBy}
        ]
        //@ts-expect-error
        let data = await new RfidRepository().aggregateBR(aggregateCond)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.getBySku`);
    }

    update = async (req: Request, res: Response) : Promise<void> => {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let { body, mongoSession, body: { loggedInUser: { _id: loggedInUserId } } } = req as RequestWithTransaction;
        let data = await new RfidRepository().update(body, loggedInUserId, mongoSession)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.updaterfid`);
    }

    rfidMapping = async (req: Request, res: Response) : Promise<void> => {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {query: {rfid, skuId}, body: { loggedInUser: {_id: loggedInUserId}}} = req as any;
        let data = await new RfidRepository().rfidMapping(rfid, skuId, loggedInUserId)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.rfidMapping`);
    }
}