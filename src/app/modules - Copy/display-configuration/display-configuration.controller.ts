import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch, Upload} from "../../helper";
import {guard} from "../../helper/Auth";
import {IDisplayConfiguration} from "./diaplay-configuration.types";
import {DisplayConfigurationValidation} from "./display-configuration.validation";
import {Messages} from "../../constants";
import {columnList} from "./display-configuration.columnList";
import {DisplayConfigurationRepository} from "./display-configuration.repository";
import {defaultColumnList} from "./display-configuration.defaultcolumnList";
import DisplayConfigurationBusiness from "./display-configuration.business";
import XLSX from "xlsx";
import displayConfigurationModel from "./display-configuration.model";


export class DisplayConfigurationController extends BaseController<IDisplayConfiguration> {
    constructor() {
        super(new DisplayConfigurationBusiness(), "user", true);
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/display-configuration', guard, this.router)

    init() {
        const validation: DisplayConfigurationValidation = new DisplayConfigurationValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.get("/admin-index", TryCatch.tryCatchGlobe(this.adminIndex));
        this.router.post("/", validation.add, TryCatch.tryCatchGlobe(this.create)); //validation.add
        this.router.put("/", validation.edit, TryCatch.tryCatchGlobe(this.update)); //validation.edit
        this.router.put("/is-active" , TryCatch.tryCatchGlobe(this.isActive)); //validation.edit
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findById));
        // this.router.post("/create-multiple", TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/update-multiple", validation.editBulk, TryCatch.tryCatchGlobe(this.updateMultiple));  //Todo add validation here...
        this.router.get("/list", TryCatch.tryCatchGlobe(this.displayConfigurationList));
        this.router.post("/import", Upload.uploadFile('/uploads/excels').single("file") , guard,TryCatch.tryCatchGlobe(this.import))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {query, query: {filters}, body: {loggedInUser: {companyId, roleId, _id}}} = req as any
        let data = [], page = 0, tempFilters: any[] = []

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = JSON.parse(filters)
            tempFilters = [...filters]
            filters = [...filters, {key: 'userId', "value": _id}]
            query.filters = await JSON.stringify(filters)
        }

        const data1: any = await new DisplayConfigurationRepository().index(query)
        console.log(data1,'..........................................')
        if(data1?.data?.length) {
            data = data1.data
            page = data1.page
        }

        if(!data?.length) {
            filters = []
            filters = [...tempFilters, {key: 'companyId', "value": companyId}, {key: 'roleId', "value": roleId}]//userId is here also
            query.filters = JSON.stringify(filters)
            const data2: any = await new DisplayConfigurationRepository().index(query)
            console.log(data2,'..........................................')
            if(data2?.data?.length) {
                data = data2?.data
                page = data2?.page
            }
            if(!data?.length) data.push({config: await new DisplayConfigurationRepository().defaultConfiguration(query)})
        }
        console.log(data,'..........................................')
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async create(req: Request, res: Response): Promise<void> {
        // res.locals = {status: false, message: Messages.CREATE_FAILED} //to do make this without returning respose af false
        let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
        if(body.companyId===undefined ||body.companyId==null|| body.companyId.length===0)
        {
            body.companyId=body.loggedInUser.companyId;
        }
        if(body.userId===undefined ||body.userId==null|| body.userId.length===0)
        {
            body.userId=body.loggedInUser._id;
        }
        if(body.roleId===undefined ||body.roleId==null|| body.roleId.length===0)
        {
            body.roleId=body.loggedInUser.roleId;
        }

        await new DisplayConfigurationController().createBC(req,res);
    }

    async update(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
        if(body.companyId===undefined ||body.companyId==null|| body.companyId.length===0)
        {
            body.companyId=body.loggedInUser.companyId;
        }
        if(body.userId===undefined ||body.userId==null|| body.length===0)
        {
            body.userId=body.loggedInUser._id;
        }
        if(body.roleId===undefined ||body.roleId==null|| body.roleId.length===0)
        {
            body.roleId=body.loggedInUser.roleId;
        }
        await new DisplayConfigurationController().updateBC(req,res);
        // const {data, page}: any = await new DisplayConfigurationController().updateBC(req,res);
        // res.locals = {status: true, page, data, message: Messages.UPDATE_SUCCESSFUL};
        // await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    async isActive(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        const {query: {_id}, body:{isActive, loggedInUser:{_id:loggedInUserId}}} = req as any
        const data = await new DisplayConfigurationRepository().isActive(_id, isActive, loggedInUserId)
        // @ts-ignore
        if(data?.nModified) res.locals = {status: true, data: data.nModified, message: Messages.UPDATE_SUCCESSFUL}
        else res.locals = {status: false, data: 0, message: Messages.UPDATE_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.isActive`);
    }

    async adminIndex(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {data, page}: any = await new DisplayConfigurationRepository().index(req.query)
        if(data.length==0)
        {
            // console.log('Default Config');
            let config: any = {};
            config.config = await new DisplayConfigurationRepository().defaultConfiguration(req.query)
            data.push(config);
        }
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.adminIndex`);
    }

    async find(req: Request, res: Response){
        //let populate = [{path: 'companyId'}, {path: 'roleId'}];
        await new DisplayConfigurationController().findBC(req, res, [])
    }

    async findById(req: Request, res: Response){
        let populate = [{path: 'companyId'}, {path: 'roleId'}];
        await new DisplayConfigurationController().findByIdBC(req, res, populate)
    }

    // async createMultiple(req: Request, res: Response){
    //     let {body:{newData, loggedInUser:{_id:loggedInUserId}}} = req
    //     let dataToBeInserted: IDisplayConfiguration[] = []
    //     newData.forEach((displayConfig: IDisplayConfiguration) => {
    //         displayConfig.createdBy = displayConfig.updatedBy = loggedInUserId
    //         dataToBeInserted.push(displayConfig)
    //     })
    //     const data = await new DisplayConfigurationBusiness().createBB(dataToBeInserted)
    //     res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    // }

    async updateMultiple(req: Request, res: Response){
        let {body:{data:newData, loggedInUser:{_id:loggedInUserId}}} = req
        const DisplayConfigurationBusinessInstance = new DisplayConfigurationBusiness()
        let dataToBeUpdated: IDisplayConfiguration[] = []
        dataToBeUpdated = newData.map(async (displayConfig: IDisplayConfiguration) => {
            displayConfig.updatedBy = loggedInUserId
            let data = await DisplayConfigurationBusinessInstance.findAndUpdateBB({"_id":displayConfig._id}, displayConfig)
            if(data) return data
            else return {_id: displayConfig._id, data: null}
        })
        const data = await Promise.all(dataToBeUpdated)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    }

    async displayConfigurationList(req: Request, res: Response): Promise<void> {

        //@ts-expect-error
        const data = await new columnList(req.query.modelName).getList()
       /* let data=[];
        let config={};
        //@ts-expect-error
        config.config = await new defaultColumnList(req.query.modelName).getList();
        data.push(config);*/

        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    }

    import = async (req: Request, res: Response): Promise<void> => {
        const { body, body:{ companyId, roleId, userId, loggedInUser:{_id:loggedInUserId}}} = req as any        
        if (!body.userId && !body.roleId) {
            res.locals.message = Messages.USERID_OR_ROLEID_MISSING
            return await JsonResponse.jsonError(req, res, `{this.url}.accessDevice`);
        };
        if (!req?.file?.path) {
            res.locals.message = Messages.INVALID_FILE
            return await JsonResponse.jsonError(req, res, `{this.url}.accessDevice`);
        };
        //@ts-expect-error
        let file: any = await new XLSX.readFile(req?.file?.path);
        const user = {createdBy: loggedInUserId, updatedBy: loggedInUserId} 
        const sheets: string[] = file.SheetNames;
        let limit: number = 0,  displayConfigData: any = [],valKey: string, text: string, align: string, 
        sequence: number, preFix: string, screen: any,postFix: string, isActive: string, isDeleted: string,
        config: any = []
        if (sheets.find(sheet => sheet.toLowerCase() === 'displayconfigaration')) {
            limit = Number(file.Sheets.displayconfigaration['!ref'].split(':')[1].slice(1));
            valKey = file.Sheets.displayconfigaration.B1.v;
            text = file.Sheets.displayconfigaration.C1.v;
            align = file.Sheets.displayconfigaration.D1.v;
            sequence = file.Sheets.displayconfigaration.E1.v;
            preFix = file.Sheets.displayconfigaration?.F1.v;
            postFix = file.Sheets.displayconfigaration?.G1.v;
            isActive = file.Sheets.displayconfigaration?.H1.v;
            isDeleted = file.Sheets.displayconfigaration?.I1.v
            screen = file.Sheets.displayconfigaration[`A2`]?.v            
            for (let i = 2; i <= limit; i++) {
                if(file.Sheets.displayconfigaration[`A${i}`]) screen = file.Sheets.displayconfigaration[`A${i}`].v
                if(file.Sheets.displayconfigaration[`A${i+1}`]) {displayConfigData.push({screen, config, companyId, userId, roleId, ...user});config = []; continue;}
                else config.push({
                    [valKey]: file.Sheets.displayconfigaration[`B${i}`]?.v, [text] : file.Sheets.displayconfigaration[`C${i}`]?.v,
                    [align]: file.Sheets.displayconfigaration[`D${i}`]?.v, [sequence]: file.Sheets.displayconfigaration[`E${i}`]?.v,
                    [preFix]: (file.Sheets.displayconfigaration[`F${i}`])?file.Sheets.displayconfigaration[`F${i}`].v: "", 
                    [postFix]: (file.Sheets.displayconfigaration[`G${i}`])?file.Sheets.displayconfigaration[`G${i}`].v: "",
                    [isActive]: file.Sheets.displayconfigaration[`H${i}`]?.v, [isDeleted]: file.Sheets.displayconfigaration[`I${i}`]?.v
                })
            }
            displayConfigData.push({screen, config, companyId, userId, roleId, ...user})
        }
        res.locals.data = await displayConfigurationModel.create(displayConfigData)
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.accessDevice`);
    }
}