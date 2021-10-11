import { model, Schema } from "mongoose";
import { IScheduleReport } from "./schedule-report.types";
import { TableName } from "../../constants";

const { Types: { ObjectId, String, Boolean } } = Schema


//user schema.
const scheduleReportSchema: Schema<IScheduleReport> = new Schema({
    to: { type: String, required: true },
    cc: [{ type: String, required: true }],
    bcc: [{ type: String, required: true }],
    isEnabled: { type: Boolean, default: 0 },
    companyId: { type: ObjectId, ref: TableName.COMPANY, required: true },
    isActive: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: 0 },
    createdBy: { type: ObjectId, ref: TableName.USER, required: true },
    updatedBy: { type: ObjectId, ref: TableName.USER, required: true },

}, { timestamps: true });

const scheduleReportModel = model<IScheduleReport>(TableName.SCHEDULE_REPORT, scheduleReportSchema);

export default scheduleReportModel