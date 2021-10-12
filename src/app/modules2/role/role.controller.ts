import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {RoleValidation} from "./role.validation"
import {guard} from "../../helper/Auth";
import RoleBusiness from "./role.business"
import {IRole} from "./role.types";
import { Errors, Messages } from "../../constants";
import { RoleRepository } from "./role.repository";

export class RoleController extends BaseController<IRole> {
    constructor() {
        super(new RoleBusiness(), "role", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/role', guard, this.router);
    }

    init() {   //Todo write validation
        const validation: RoleValidation = new RoleValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/",validation.createRole, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/",validation.updateRole, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.delete));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const {data, page}: any = await new RoleRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }

    create = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        const data = await new RoleRepository().create(body)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    update = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.updatedBy = loggedInUserId
        const data = await new RoleRepository().update(body)
        if(!data ) throw Messages.UPDATE_FAILED
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    delete = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.DELETE_FAILED}
        let { query: {_id: roleId}, body:{ loggedInUser:{_id:loggedInUserId}}} = req
        const data = await new RoleRepository().delete(roleId as any, loggedInUserId)
        res.locals = {status: true, message: Messages.DELETE_SUCCESSFUL, data: 1}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        let {body: {loggedInUser: {_id: loggedInUserId}}} = req
        let data = await new RoleRepository().filter(loggedInUserId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}