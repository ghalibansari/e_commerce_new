import { BaseController } from "../BaseController"
import { Application } from "express"
import { TryCatch } from "../../helper"
import { guard } from "../../helper/Auth"
import ScheduleReportBusiness from "./schedule-report.business"
import { IScheduleReport } from "./schedule-report.types"
import { ScheduleReportValidation } from "./schedule-report.validation"

export class ScheduleReportController extends BaseController<IScheduleReport> {
    constructor() {
        super(new ScheduleReportBusiness(), "device-command", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/schedule-summary', guard, this.router);
    }

    init() {
        const validation: ScheduleReportValidation = new ScheduleReportValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.post("/", validation.scheduleReport, TryCatch.tryCatchGlobe(this.createBC));
    }
}