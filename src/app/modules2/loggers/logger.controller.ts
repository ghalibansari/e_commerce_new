import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import SkuBusiness from "./logger.business";
import {guard} from "../../helper/Auth";
import {ILogger, loggerLevelEnum} from "./logger.types";
import {LoggerValidation} from "./logger.validation";
import {modulesEnum} from "../../constants/Modules";
import {LoggerRepository} from "./logger.repository";
import LoggerBusiness from "./logger.business";
import {Messages} from "../../constants";
import {UserRepository} from "../user/user.repository";

export class LoggerController extends BaseController<ILogger> {
    constructor() {
        super(new LoggerBusiness(), modulesEnum.logger, true, new LoggerRepository());
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/logger', guard, this.router);
    }

    init() {   //Todo write validation
        const validation: LoggerValidation = new LoggerValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        // this.router.get("/index", TryCatch.tryCatchGlobe(() => {throw new Error('error testing...')}));
        this.router.post("/", validation.createLogger, TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", validation.updateLogger, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        // this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new LoggerRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }
}