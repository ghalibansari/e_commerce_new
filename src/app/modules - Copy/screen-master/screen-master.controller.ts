import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {IScreenMasterTypes} from "./screen-master.types";
import ScreenMasterBusiness from "./screen-master.business";
import {ScreenMasterRepository} from "./screen-master.repository";
import {ScreenMasterValidation} from "./screen-master.validation";
import {Constant, Messages, Texts} from "../../constants";



export class ScreenMasterController extends BaseController<IScreenMasterTypes> {
    constructor() {
        super(new ScreenMasterBusiness(), "screen-master", true, new ScreenMasterRepository());
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/screen-master', guard, this.router);
    }

    init() {
        const validation: ScreenMasterValidation = new ScreenMasterValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.add, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.edit, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findById));

        // this.router.post("/create-multiple", TryCatch.tryCatchGlobe(this.createMultipleBC));
        // this.router.put("/update-multiple", TryCatch.tryCatchGlobe(this.updateMultiple));
        // this.router.get("/list", TryCatch.tryCatchGlobe(this.displayConfigurationList));
    }

    async find(req: Request, res: Response){
        //let populate = [{path: 'companyId'}, {path: 'roleId'}];
        await new ScreenMasterController().findBC(req, res)
    }

    async findById(req: Request, res: Response){
        let populate = [{path: 'companyId'}, {path: 'roleId'}];
        await new ScreenMasterController().findByIdBC(req, res, populate)
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

    // async updateMultiple(req: Request, res: Response){
    //     let {body:{data:newData, loggedInUser:{_id:loggedInUserId}}} = req
    //     const DisplayConfigurationBusinessInstance = new DisplayConfigurationBusiness()
    //     let dataToBeUpdated: IDisplayConfiguration[] = []
    //     dataToBeUpdated = newData.map(async (displayConfig: IDisplayConfiguration) => {
    //         displayConfig.updatedBy = loggedInUserId
    //         let data = await DisplayConfigurationBusinessInstance.findAndUpdateBB({"_id":displayConfig._id}, displayConfig)
    //         if(data) return data
    //         else return {_id: displayConfig._id, data: null}
    //     })
    //     const data = await Promise.all(dataToBeUpdated)
    //     res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    // }
    //
    //
    // async displayConfigurationList(req: Request, res: Response): Promise<void> {
    //     let data: any = {}  //Always Add new modules here manually...
    //     const modules = [ activityModel, addressModel,
    //         alertModel, BusinessModel, commentModel, companyModel, contactModel, deviceModel , diamondMatchModel, diamondMatchRuleModel, giaModel, labModel,
    //         rapPriceModel, roleModel, skuModel, transitModel, userModel,iavModel];
    //
    //     modules.forEach(module => data[module.modelName] = Object.keys(module['schema']['obj']))
    //     res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    // }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page, header}: any = await new ScreenMasterRepository().index(req.query as any);
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }
}