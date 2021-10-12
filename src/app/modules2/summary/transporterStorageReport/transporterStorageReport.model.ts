import {Document, model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import { ITransporterStorageReport } from "./transaporterStorageReport.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const TransporterStorageReportSchema: Schema = new Schema<Document<ITransporterStorageReport>>({
    ref: {type: String, default: ""},
    transitId: {type: String, default: ""},
    tagId: {type: String, default: ""},
    company: {type: String, default: ""},
    companyId: {type: ObjectId, required: true},  
    reportLab: {type: String, default: ""},
    reportNumber: {type: String, default: ""},
    caratWeight: {type: Number, default: 0},
    shape: {type: String, default: ""},
    color: {type: String, default: ""},
    clarity: {type: String, default: ""},
    cut: {type: String, default: ""},
    value: {type: Number, default: 0},
    dismissed: {type: String, default: ""},
    stages: {type: String, default: ""},
    nonMatchStages: {type: String, default: ""},
    returnDate: {type: Date, default: null},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
},  {timestamps: {createdAt: true, updatedAt: false}, versionKey: false});

const TransporterStorageReportModel = model<ITransporterStorageReport>(TableName.TRANSPORTER_STORAGE_REPORT, TransporterStorageReportSchema);

export default TransporterStorageReportModel
