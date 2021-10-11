import { model, Schema } from "mongoose";
import { ISummaryReport } from "./summary.types";
import { TableName } from "../../constants";

const { Types: { ObjectId, String, Boolean } } = Schema


//user schema.
const summaryReportSchema: Schema<ISummaryReport> = new Schema({
    companyId: { type: ObjectId, ref: TableName.COMPANY, required: true },
    filePath:{ type: String, required: true },
    reportType : {type: String, enum: ["Cron", "Manual"], default: "Manual"},
    isActive: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: 0 },
    createdBy: { type: ObjectId, ref: TableName.USER, required: true },
    updatedBy: { type: ObjectId, ref: TableName.USER, required: true },

}, { timestamps: true });

const summaryReportModel = model<ISummaryReport>(TableName.SUMMARY_REPORT, summaryReportSchema);

export default summaryReportModel