import { BaseRepository } from "../BaseRepository";
import scheduleReportModel from "./schedule-report.model";
import { IScheduleReport } from "./schedule-report.types";


export class ScheduleReportRepository extends BaseRepository<IScheduleReport> {
    constructor() {
        super(scheduleReportModel);
    }
}