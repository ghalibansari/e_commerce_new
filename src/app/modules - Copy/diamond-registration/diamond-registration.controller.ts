import { BaseController } from "../BaseController"
import { Application, Request, Response } from "express";
import { TryCatch, JsonResponse } from "../../helper";
import { guard } from "../../helper/Auth"
import { Messages, Constant } from "../../constants";
import { TransactionRepository } from "../transaction/transaction.repository";
import DiamondRegistrationBusiness from "./diamond-registration.business";
import { IDiamondRegistration } from "./diamond-registration.types";
import { DiamondRegistrationRepository } from "./diamond-registration.repository";


export class DiamondRegistrationController extends BaseController<IDiamondRegistration> {
    constructor() {
        super(new DiamondRegistrationBusiness(), "diamond-registration", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/diamond-registration', guard, this.router);
    }

    init() {
        // const validation: CreateBusinessValidation = new CreateBusinessValidation();
        // this.router.post("/",validation.createBusiness, TryCatch.tryCatchGlobe(this.create))
        // this.router.get('/index',TryCatch.tryCatchGlobe(this.index))
        // this.router.get("/detail", validation.detail, TryCatch.tryCatchGlobe(this.findReview))
        // this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
        this.router.get("/failure", TryCatch.tryCatchGlobe(this.getErrorDiamondRegistration))
        this.router.get("/failure/filterCriteria", TryCatch.tryCatchGlobe(this.filter))

    }

    async getErrorDiamondRegistration(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page, header}: any = await new DiamondRegistrationRepository().getErrorDiamondRegistration(req.query as any)
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req;
        let data = await new DiamondRegistrationRepository().filter(loggedInUserId);
        data.company.sort((a: any, b: any) => {return  (a.sorted).localeCompare(b.sorted);});
        // if (data) {
        //     data.labs = [].concat.apply([], data.labs);
        //     data.labs = [...new Set(data.labs.map((labData: any) => labData.lab))];
        //     data.weight = { max: Math.max(...data.uniqueWeight), min: Math.min(...data.uniqueWeight), values: data.uniqueWeight.sort((n1: number, n2: number) => n1 - n2) };
        //     data.iav = { max: Math.max(...data.uniqueIav), min: Math.min(...data.uniqueIav), values: data.uniqueIav.sort((n1: number, n2: number) => n1 - n2) };
        //     data.pwv = { max: Math.max(...data.uniquePwv), min: Math.min(...data.uniquePwv), values: data.uniquePwv.sort((n1: number, n2: number) => n1 - n2) };
        //     data.drv = { max: Math.max(...data.uniqueDrv), min: Math.min(...data.uniqueDrv), values: data.uniqueDrv.sort((n1: number, n2: number) => n1 - n2) };
        //     let rapPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueRapPrices.sort((n1: number, n2: number) => n1 - n2) };
        //     data.price = { rapPrice };
        //     let clientPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueClientPrices.sort((n1: number, n2: number) => n1 - n2) };
        //     data.price = { ...data.price, clientPrice };
        //     // data.dmStatus = ["MATCHED", "NOTMATCHED"];
        //     delete data.uniqueWeight;
        //     delete data.uniqueIav;
        //     delete data.uniquePwv;
        //     delete data.uniqueDrv;
        //     delete data.uniqueClientPrices;
        //     delete data.uniqueRapPrices
        // }
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

}
