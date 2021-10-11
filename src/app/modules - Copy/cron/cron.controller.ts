import {BaseController} from "../BaseController"
import {Application, Request, Response} from "express"
import {JsonResponse, TryCatch} from "../../helper"
import {guard} from "../../helper/Auth"
import {cronName, ICron} from "./cron.types";
import CronBusiness from "./cron.business";
import {IUser} from "../user/user.types";
import {cronJobActivityHistory, cronJobDiamondMatch, cronJobFetchPrice, cronJobPowerBiReport, cronJobUpdateSku} from "./cron.jobs";
import {CronTime} from "cron";
import {CronValidation} from "./cron.validation";
import {Messages} from "../../constants";
import {CronRepository} from "./cron.repository";

export class CronController extends BaseController<ICron> {
    constructor() {
        super(new CronBusiness(), "cron", true, new CronRepository())
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/cron', guard, this.router);
    }

    init() {
        const validation: CronValidation = new CronValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createCron, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateCron, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }

    async update(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        const CronControllerInstance = new CronController()
        const {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.updatedBy = loggedInUserId;
        const data = await new CronBusiness().findAndUpdateBB({_id}, body)
        if(!data) throw new Error('Invalid Cron Job Update.')
        else if(data?.name === cronName.FETCH_RAPPORT_PRICE) await CronControllerInstance.cronUpdate(data, cronJobFetchPrice)
        else if(data?.name === cronName.ACTIVITY_HISTORY) await CronControllerInstance.cronUpdate(data, cronJobActivityHistory)
        else if(data?.name === cronName.DIAMOND_MATCH) await CronControllerInstance.cronUpdate(data, cronJobDiamondMatch)
        else if(data?.name === cronName.UPDATE_SKU) await CronControllerInstance.cronUpdate(data, cronJobUpdateSku)
        else if(data?.name === cronName.POWER_BI_REPORT) await CronControllerInstance.cronUpdate(data, cronJobPowerBiReport)

        if(data) res.locals = {status: true, data, message: Messages.UPDATE_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, "update")
    }

    async cronUpdate(data: ICron, job: any): Promise<void> {
        if(data.isActive){
            await job.start();
            await job.setTime(new CronTime(data.time))
        }
        else await job.stop()
    }
}