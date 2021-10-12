import {BaseController} from "../BaseController"
import DeviceBusiness from "./device.business"
import {IDevice} from "./device.types"
import {DeviceValidation} from "./device.validation";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {Errors, Messages} from "../../constants";
import CompanyBusiness from "../company/company.business";
import DeviceTypeBusiness from "../device-type/device-type.business";
import {DeviceRepository} from "./device.repository";
import { MongooseTransaction } from "../../helper/MongooseTransactions";
import { RequestWithTransaction } from "../../interfaces/Request";
import * as Excel  from 'exceljs'
import path from 'path'
import { disPlayConfigindex } from "../../helper/displayConfigData";
import lo from "lodash";
import userModel from "../user/user.model";


export class DeviceController extends BaseController<IDevice> {
    constructor() {
        // super(new DeviceBusiness(), "device", true, new DeviceRepository(), ['name'])
        super(new DeviceBusiness(), "device", true, new DeviceRepository())
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/device', guard, this.router);
    }

    init() {
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: DeviceValidation = new DeviceValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.createDevice, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/", validation.updateDevice, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
        this.router.post("/register-device", transaction.startTransaction,TryCatch.tryCatchGlobe(this.registerDevice))
        this.router.get("/exportExcel", TryCatch.tryCatchGlobe(this.exportReport));
        this.router.post("/access",TryCatch.tryCatchGlobe(this.accessDevice))
        this.router.post("/remove/access",TryCatch.tryCatchGlobe(this.removeAccessDevice))
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))

    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {data, page}: any = await new DeviceRepository().index(req.query)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async create(req: Request, res: Response): Promise<void> {       
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}}  = req                
        await new DeviceController().checkIds(body);
        body.createdBy = body.updatedBy = loggedInUserId
        res.locals.data = await new DeviceBusiness().createBB(body);
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    }

    async update(req: Request, res: Response): Promise<void> {
        //@ts-expect-error
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} : {body:IDevice} = req        
        await new DeviceController().checkIds(body);
        body.updatedBy = loggedInUserId
        let data = await new DeviceBusiness().findAndUpdateBB({_id}, body);
        if(data) {res.locals.data = data; res.locals.message = Messages.UPDATE_SUCCESSFUL;}
        else {res.locals.data = data; res.locals.message = Messages.UPDATE_FAILED;}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    async checkIds(body:IDevice): Promise<void|never> {
        let [deviceTypeData , companyIdData, userIds] = await Promise.all([
            await new DeviceTypeBusiness().findIdByIdBB(body.deviceTypeId),
            await new CompanyBusiness().findIdByIdBB(body.companyId),
            await userModel.find({"_id": {$in : body.userIds}, companyId: body.companyId, isDeleted:false}, '_id')
        ]);
        if(userIds.length !== body.userIds.length) throw Errors.INVALID_USER_ID; 
        if(!deviceTypeData?._id) throw new Error("Invalid deviseTpeId")
        if(!companyIdData?._id) throw new Error("Invalid companyTypeId")
    }

    async find(req: Request, res: Response): Promise<void> {
        let populate = [{path: "deviceTypeId"},{path: "companyId"}]
        await new DeviceController().findBC(req, res, populate)
    }

    async registerDevice(req: Request, res: Response): Promise<void> {
        let {body, body:{ loggedInUser:{_id:loggedInUserId}}, mongoSession}  = req as RequestWithTransaction;
        body.createdBy = body.updatedBy = loggedInUserId        
        let data = await new DeviceRepository().registerDevice(body, mongoSession)
        res.locals = data
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async exportReport(req: Request, res: Response): Promise<void> {
        let workbook = new Excel.Workbook();
        req.query.displayConfig = [{"key":"screen","value":"ManageDevices"}]
        let [device, displayConfig] = await Promise.all([
            await new DeviceRepository().index(req.query),
            await disPlayConfigindex(req)
        ])
        const headerData: any = [];        
        displayConfig[0].config.map((item: any) => {if(item.isActive === true) headerData.push({ name: item.text, filterButton: true })});        

        //console.log("---------------DB-----",data);

        // let headerData = [{ name: "Serial Number", filterButton: true }, { name: "Name", filterButton: true }, { name: "Description", filterButton: true }, { name: "Company Name", filterButton: true }, { name: "DeviceType Code", filterButton: true }]

        let requiredData: any = [];
        // requiredData.push(arr);
        // for (let i = 0; i < data.length; i++) {

        //     arr = [data[i].serialNumber, data[i].name, data[i].description, data[i].companyId?.name, data[i].deviceTypeId?.code];
        //     requiredData.push(arr);
        // }
        //@ts-expect-error
        for (const [i, element] of device.data.entries()) {
            let arr: any[] = []
            for (const item of displayConfig[0].config) {
                let valKey = item.valKey.split(".")
                if(item.isActive === false) continue
                
                if(valKey.length ===1 && valKey[0] === "isActive")(element.isActive === true)? arr.push("Active"): arr.push("InActive");
                else (lo.get(element, valKey)) ? arr.push(lo.get(element, valKey)) : arr.push('')
            }
            requiredData.push(arr);
        }

        let worksheet = workbook.addWorksheet('Device Export')
        await new DeviceBusiness().exportExcel(worksheet, headerData, requiredData)
        let fileName = 'DeviceExport.xlsx'
        await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
        res.download(path.join(__dirname, `${fileName}`), (err) => {
            if (err) {
                if (err) { res.status(400).json({ status: 400, success: false, message: err }) }
                console.log("DownloadError", err);
            }
        })
    }

    async accessDevice(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req        
        let data = await new DeviceRepository().accessDevice(body, loggedInUserId)
        res.locals = data
        await JsonResponse.jsonSuccess(req, res, `{this.url}.accessDevice`);
    }

    async removeAccessDevice(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req        
        let data = await new DeviceRepository().removeAccessDevice(body, loggedInUserId)
        res.locals = data
        await JsonResponse.jsonSuccess(req, res, `{this.url}.accessDevice`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new DeviceRepository().filter(loggedInUserId)
        data.companies.sort((a: any, b: any) => {return  (a.sorted).localeCompare(b.sorted);});
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}