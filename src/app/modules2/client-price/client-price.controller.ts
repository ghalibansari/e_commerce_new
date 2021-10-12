import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import { IClientPrice } from "./client-price.types";
import ClientPriceBusiness from "./client-price.business";
import { Messages } from "../../constants";
import { ClientPriceRepository } from "./client-price.repository";
import { SkuRepository } from "../sku/sku.repository";
import { MongooseTransaction } from "../../helper/MongooseTransactions";
import { RequestWithTransaction } from "../../interfaces/Request";
import { ClientPriceValidation } from "./client-price.validation";
import session from "express-session";

export class ClientPriceController extends BaseController<IClientPrice> {
    constructor() {
        super(new ClientPriceBusiness(), "client-price");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/client-price', guard, this.router);
    }

    init() {
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: ClientPriceValidation = new ClientPriceValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", transaction.startTransaction, validation.createClientPrice , TryCatch.tryCatchGlobe(this.create));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.put("/",TryCatch.tryCatchGlobe(this.update))
    }

    create = async (req: Request, res: Response) => {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{skuIds, price, transactionId, loggedInUser:{_id:loggedInUserId}}, mongoSession} = req as RequestWithTransaction    
        await new ClientPriceRepository().create(skuIds, price, loggedInUserId)
        // if(transactionId) await new SkuRepository().transtionCount(body, mongoSession)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    update = async (req: Request, res: Response) => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
        let data = await new ClientPriceRepository().update(body, loggedInUserId)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }
}