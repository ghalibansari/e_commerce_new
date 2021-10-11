import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import { IAlertConfiguration } from "./alert-configuration.types";
import AlertConfigurationBusiness from "./alert-configuration.business";
import {Messages, Texts} from "../../constants";
import { AlertConfigurationRepository } from "./alert-configuration.repository";
import alertConfigurationModel from "./alert-configuration.model";
import { AlertConfigurationValidation } from "./alert-configuration.validation";

export class AlertConfigurationController extends BaseController<IAlertConfiguration> {
    constructor() {
        super(new AlertConfigurationBusiness(), "alertConfiguration", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/alert-configuration',guard, this.router);
    }

    init() {
        const validation: AlertConfigurationValidation = new AlertConfigurationValidation();
        // this.router.get("/",  TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/" , validation.createAlertConfiguration, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/", validation.updateAlertConfiguration ,  TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));   // delete is not required in this module
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
        this.router.get("/dummy", TryCatch.tryCatchGlobe(this.dummy))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const {data, page}: any = await new AlertConfigurationRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    create = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{ loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        const data = await new AlertConfigurationRepository().create(body)
        res.locals = {status: true, data, message: Messages.CREATE_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    update = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        let {body, body:{ loggedInUser:{_id:loggedInUserId}}} = req
        body.updatedBy = loggedInUserId
        const data = await new AlertConfigurationRepository().update(body)
        res.locals = {status: true, data, message: Messages.UPDATE_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    dummy = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{ loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        let data1 = await alertConfigurationModel.aggregate([
            {$match: {isDeleted: false, category: "BUSINESS"}},
            {$lookup: {from: 'users', localField: 'reciever', foreignField: '_id', as: 'reciever'}},{$unwind: {path: "$reciever", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'cc', foreignField: '_id', as: 'cc'}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
        ])
        const data = await new AlertConfigurationRepository().alertConfig(data1, loggedInUserId)
        res.locals = {status: true, data, message: Messages.CREATE_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new AlertConfigurationRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

}