import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch, Upload} from "../../helper";
import {guard} from "../../helper/Auth";
import PermissionBusiness from "./permission.business";
import {PermissionRepository} from "./permission.repository";
import {IPermission} from "./permission.types";
import {Messages, Texts} from "../../constants";
import {RequestWithTransaction} from "../../interfaces/Request";
import {PermissionValidation} from "./permission.validation";
import XLSX from "xlsx";
import permissionModel from "./permission.model";

export class PermissionController extends BaseController<IPermission> {
    constructor() {
        super(new PermissionBusiness(), "permission", true, new PermissionRepository());
        this.init();
    }

    register(express: Application): void {
        express.use('/api/v1/permission', guard, this.router);
    }

    init(): void {   //Todo write validation
        const validation: PermissionValidation = new PermissionValidation()
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.add, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.edit, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/import", Upload.uploadFile('/uploads/excels').single("file") , guard,TryCatch.tryCatchGlobe(this.import))
    }

    async update(req: Request, res: Response): Promise<void>{
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        let {body, body:{userId, roleId, companyId, loggedInUser:{_id:loggedInUserId}}} = req as RequestWithTransaction
        body.updatedBy = body.createdBy = loggedInUserId
        if(!companyId) throw new Error('CompanyId is required')
        let cond:any = {companyId}
        if(userId) cond.userId = userId
        if(roleId) cond.roleId = roleId
        // if(userId && !roleId && !companyId) cond = {userId}
        // else if(!userId && roleId && companyId) cond = {roleId, companyId}
        // else if(userId && (roleId || companyId)) throw new Error('Only userId or companyId and roleId is Allowed')
        // else if(userId && roleId && companyId) throw new Error('Only userId or companyId and roleId is Allowed')
        let data = await new PermissionRepository().findAndUpdateBR(cond, body)
        //@ts-expect-error
        data = data?.n
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `update`);
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const PermissionRepositoryInstance = new PermissionRepository()
        let {query, query: {filters}, body: {loggedInUser: {companyId, roleId, roleName, _id}}} = req as any
        let data = [], page = 0, tempFilters: any[] = []

        if(roleName !== Texts.SPACECODEADMIN) {
            // if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            //     filters = JSON.parse(filters)
            //     tempFilters = [...filters]
            //     filters = [...filters, {key: 'userId', "value": _id}]
            filters = [{key: 'userId', "value": _id}]
            query.filters = await JSON.stringify(filters)
            // }

            const data1: any = await PermissionRepositoryInstance.index(query)
            if (data1?.data?.length) {
                data = data1.data
                page = data1.page
            }

            if (!data?.length) {
                filters.length = 0
                filters = [{key: 'companyId', "value": companyId}, {key: 'roleId', "value": roleId}]//userId is here also
                query.filters = JSON.stringify(filters)
                const data2: any = await PermissionRepositoryInstance.index(query)
                if (data2?.data?.length) {
                    data = data2.data
                    page = data2.page
                }
                if (!data.length) {
                    const data3 = await PermissionRepositoryInstance.defaultConfiguration(req?.body?.loggedInUser?.roleName)
                    if (data3) data.push(data3)
                }
            }
        }
        else{
         const datax: any = await PermissionRepositoryInstance.index(query)
            if (datax?.data?.length) {
                data = datax.data
                page = datax.page
            }
            if (!data.length) {
                const data3 = await PermissionRepositoryInstance.defaultConfiguration(req?.body?.loggedInUser?.roleName)
                if (data3) data.push(data3)
            }
        }
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async per(req: Request, res: Response): Promise<any[]> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const PermissionRepositoryInstance = new PermissionRepository()
        let {query, query: {filters}, body: {loggedInUser: {companyId, roleId, _id}}} = req as any
        let data = [], page = 0, tempFilters: any[] = []

        // if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
        //     filters = JSON.parse(filters)
        //     tempFilters = [...filters]
        //     filters = [...filters, {key: 'userId', "value": _id}]
        filters = [{key: 'userId', "value": _id}]
        query.filters = await JSON.stringify(filters)
        // }
        const data1: any = await PermissionRepositoryInstance.index(query)
        if(data1?.data?.length) {
            data = data1.data
            page = data1.page
        }

        if(!data?.length) {
            filters.length = 0
            filters = [{key: 'companyId', "value": companyId}, {key: 'roleId', "value": roleId}]//userId is here also
            query.filters = JSON.stringify(filters)
            console.log('33333333333333333333333')
            const data2: any = await PermissionRepositoryInstance.index(query)
            if(data2?.data?.length) {
                data = data2.data
                page = data2.page
            }
            if(!data.length) {
                const data3 = await PermissionRepositoryInstance.defaultConfiguration(req?.body?.loggedInUser?.roleName)
                if(data3) data.push(data3)
            }
        }
        return data
    }

    import = async (req: Request, res: Response): Promise<void> => {
        const { body, body:{ companyId, roleId, userId, loggedInUser:{_id:loggedInUserId}}} = req as any        
        if (!body.userId && !body.roleId) {
            res.locals.message = Messages.USERID_OR_ROLEID_MISSING
            return await JsonResponse.jsonError(req, res, `{this.url}.accessDevice`);
        } 
        if (!req?.file?.path) {
            res.locals.message = Messages.INVALID_FILE
            return await JsonResponse.jsonError(req, res, `{this.url}.accessDevice`);
        }
        //@ts-expect-error
        let file: any = await new XLSX.readFile(req?.file?.path);                
        const sheets: string[] = file.SheetNames;
        let limit: number = 0,  permission: any = [],key: string, value: string, screen: any,
        access: any = []
        if (sheets.find(sheet => sheet.toLowerCase() === 'permission')) {
            limit = Number(file.Sheets.permission['!ref'].split(':')[1].slice(1));
            value = file.Sheets.permission.B1.v;
            key = file.Sheets.permission.C1.v;
            for (let i = 2; i <= limit; i++) {
                if(file.Sheets.permission[`A${i}`]) screen = file.Sheets.permission[`A${i}`].v
                if(file.Sheets.permission[`A${i+1}`]) {permission.push({screen, access});access = []; continue;}
                else access.push({
                    [value]: file.Sheets.permission[`B${i}`].v,
                    [key]: file.Sheets.permission[`C${i}`].v
                })
            }
            permission.push({screen, access})
        }        
        res.locals.data = await permissionModel.create({companyId, userId, roleId, permission, createdBy: loggedInUserId, updatedBy: loggedInUserId})
        // res.locals.data = {companyId, userId, roleId, permission}
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.accessDevice`);
    }
}