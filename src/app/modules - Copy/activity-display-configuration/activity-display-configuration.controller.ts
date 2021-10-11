import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import activityModel from "../activity/activity.model";
import addressModel from "../address/address.model";
import alertModel from "../alert/alert.model";
import BusinessModel from "../business/business.model";
import commentModel from "../comment/comment.model";
import companyModel from "../company/company.model";
import contactModel from "../contact/contact.model";
import deviceModel from "../device/device.model";
import diamondMatchModel from "../diamond-match/diamond-match.model";
import diamondMatchRuleModel from "../diamond-match-rule/diamond-match-rule.model";
import giaModel from "../gia/gia.model";
import labModel from "../lab/lab.model";
import rapPriceModel from "../rap-price/rap-price.model";
import roleModel from "../role/role.model";
import skuModel from "../sku/sku.model";
import transitModel from "../transit/transit.model";
import userModel from "../user/user.model";
import {Messages} from "../../constants";
import iavModel from "../iav/iav.model";
import {IActivityDisplayConfigurationTypes} from "./activity-display-configuration.types";
import DisplayConfigurationBusiness from "../display-configuration/display-configuration.business";
import {ActivityDisplayConfigurationValidation} from "./activity-display-configuration.validation";
import {ActivityDisplayConfigurationRepository} from "./activity-display-configuration.repository";
import {IDisplayConfiguration} from "../display-configuration/diaplay-configuration.types";
import ActivityDisplayConfigurationBusiness from "./activity-display-configuration.business";


//Todo delete this module...

export class ActivityDisplayConfigurationController extends BaseController<IActivityDisplayConfigurationTypes> {
    constructor() {
        super(new ActivityDisplayConfigurationBusiness(), "activity-display-configuration", true, new ActivityDisplayConfigurationRepository());
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/activity-display-configuration', guard, this.router);
    }

    init() {
        const validation: ActivityDisplayConfigurationValidation = new ActivityDisplayConfigurationValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.post("/", validation.add, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.edit, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findById));

        this.router.post("/create-multiple", TryCatch.tryCatchGlobe(this.createMultipleBC));    //Todo add validation here...
        this.router.put("/update-multiple", TryCatch.tryCatchGlobe(this.updateMultiple));  //Todo add validation here...
        this.router.get("/list", TryCatch.tryCatchGlobe(this.displayConfigurationList));
    }

    async find(req: Request, res: Response){
        //let populate = [{path: 'companyId'}, {path: 'roleId'}];
        await new ActivityDisplayConfigurationController().findBC(req, res)
    }

    async findById(req: Request, res: Response){
        let populate = [{path: 'companyId'}, {path: 'roleId'}];
        await new ActivityDisplayConfigurationController().findByIdBC(req, res, populate)
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
        let data: any = {}  //Always Add new modules here manually...
        const modules = [ activityModel, addressModel,
            alertModel, BusinessModel, commentModel, companyModel, contactModel, deviceModel , diamondMatchModel, diamondMatchRuleModel, giaModel, labModel,
            rapPriceModel, roleModel, skuModel, transitModel, userModel,iavModel];

        modules.forEach(module => data[module.modelName] = Object.keys(module['schema']['obj']))
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    }
}