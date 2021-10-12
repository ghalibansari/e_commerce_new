import { BaseBusiness } from '../BaseBusiness'
import { ScheduleReportRepository } from "./schedule-report.repository"
import { IScheduleReport } from "./schedule-report.types";


class ScheduleReportBusiness extends BaseBusiness<IScheduleReport> {
    private _scheduleReportRepository: ScheduleReportRepository;

    constructor() {
        super(new ScheduleReportRepository())
        this._scheduleReportRepository = new ScheduleReportRepository();
    }
}


Object.seal(ScheduleReportBusiness);
export = ScheduleReportBusiness;