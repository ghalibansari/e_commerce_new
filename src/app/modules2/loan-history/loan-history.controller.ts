import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {ILoanHistory} from "./loan-history.types";
import LoanHistoryBusiness from "./loan-history.business";
import {LoanValidationValidation} from "./loan-history.validation";
import {LoanHistoryRepository} from "./loan-history.repository";
import {Messages} from "../../constants";


export class LoanHistoryController extends BaseController<ILoanHistory> {
    constructor() {
        super(new LoanHistoryBusiness(), 'loan-history', true);
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/loan-history', guard, this.router)

    init() {
        const validation: LoanValidationValidation = new LoanValidationValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.index));
        // this.router.post("/", validation.createLoan, TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", validation.updateUser, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new LoanHistoryRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }
}
