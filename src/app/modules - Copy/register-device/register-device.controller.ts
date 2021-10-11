import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {UserValidation} from "../user/user.validation"
import {guard} from "../../helper/Auth";
import {Messages} from "../../constants";
import {IComment} from "../comment/comment.types";
import RegisterDeviceBusiness from "./register-device.business";
import { IRegisterDevice } from "./register-device.types";
import { RegisterDeviceRepository } from "./register-device.repository";
import { MongooseTransaction } from "../../helper/MongooseTransactions";
import { RequestWithTransaction } from "app/interfaces/Request";

export class RegisterDeviceController extends BaseController<IRegisterDevice> {
    constructor() {
        super(new RegisterDeviceBusiness(), "registerDevice");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/register-device', guard, this.router);
    }

    init() {   //Todo write validation
        const transaction: MongooseTransaction = new MongooseTransaction();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/", TryCatch.tryCatchGlobe(this.updateBC));
        // this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        // this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }

    async create(req: Request, res: Response): Promise<void> {
        let {body, body:{ loggedInUser:{_id:loggedInUserId}}, mongoSession}  = req as RequestWithTransaction;
        body.createdBy = body.updatedBy = loggedInUserId
        let data = await new RegisterDeviceRepository().create(body, mongoSession)
        res.locals = data
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }
    
}