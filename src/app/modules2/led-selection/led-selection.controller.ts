import { BaseController } from "../BaseController";
import { Application, Request, Response } from "express";
import { JsonResponse, TryCatch } from "../../helper";
import { guard } from "../../helper/Auth";
import { ILedSelection } from "./ledSelection.types";
import LedSelectionBusiness from "./led-selection.business";
import { LedSelectionRepository } from "./led-selection.repository";
import { Messages, Texts } from "../../constants";
import { MongooseTransaction } from "../../helper/MongooseTransactions";
import { RequestWithTransaction } from "app/interfaces/Request";
import { LedSelectionValidation } from "./led-selection.validation";
import deviceModel from "../device/device.model";
import { devices } from "../../socket";
import { ErrorCodes } from "../../constants/ErrorCodes";
import ledSelectionModel from "./led-selection.model";
import mongoose, {ClientSession} from "mongoose";


export class LedSelectionController extends BaseController<ILedSelection> {
    constructor() {
        super(new LedSelectionBusiness(), "ledSelection");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/led-selection', guard, this.router);
    }

    init() {   //Todo write validation
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: LedSelectionValidation = new LedSelectionValidation()
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.delete("/", validation.removeLedSelection, transaction.startTransaction, TryCatch.tryCatchGlobe(this.deleteMany));
        this.router.put("/", validation.updateledSelection, transaction.startTransaction, TryCatch.tryCatchGlobe(this.update))
        this.router.get("/", TryCatch.tryCatchGlobe(this.ledSelection))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.FETCH_FAILED };
        const { data, page }: any = await new LedSelectionRepository().index(req.query as any)
        res.locals = { status: true, page, data, message: Messages.FETCH_SUCCESSFUL };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async deleteMany(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.DELETE_FAILED, data: null };
        let { body: { loggedInUser: { _id: loggedInUserId } }, mongoSession, query: { ledSelectionIds } } = req as RequestWithTransaction
        //@ts-expect-error
        ledSelectionIds = JSON.parse(ledSelectionIds);
        //@ts-expect-error
        ledSelectionIds?.forEach((ledSelection: string, index: number) => ledSelectionIds[index] = mongoose.Types.ObjectId(ledSelection));

        let ledData = await ledSelectionModel.aggregate([
            {$match: {_id: {$in : ledSelectionIds}, isDeleted: false}},
            {$group: {
                _id: null,
                companyId: {$addToSet: "$companyId"}
            }}
        ]).then(data => data[0])
        res.locals = await new LedSelectionRepository().deleteMany(ledSelectionIds, mongoSession);
        let registerDevice = await deviceModel.find({companyId: {$in : ledData?.companyId}, isDeleted: false});
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_LED_SELECTION, message: "deleted Led Selection", data:null});    
        }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteMany`);
    }

    update = async (req: Request, res: Response): Promise<void> => {
        res.locals = { status: false, message: Messages.UPDATE_FAILED };
        let { body, mongoSession, body: { loggedInUser: { _id: loggedInUserId, companyId } } } = req as RequestWithTransaction
        // if (body.tagNos) body.tagCount = body.clientRefId.length
        let user = { createdBy: loggedInUserId, updatedBy: loggedInUserId };
        let data = await new LedSelectionRepository().update(body, user, mongoSession);
        let registerDevice = await deviceModel.find({companyId: data?.companyId, isDeleted: false});
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_LED_SELECTION, message: "Led Selection updated", data: null});
        }
        res.locals = { status: true, data, message: Messages.UPDATE_SUCCESSFUL };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    ledSelection = async (req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser: {_id: loggedInUserId, companyId }}} = req
        let data = await new LedSelectionRepository().ledSelection(companyId)
        res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.ledSelection`);
    }
}
