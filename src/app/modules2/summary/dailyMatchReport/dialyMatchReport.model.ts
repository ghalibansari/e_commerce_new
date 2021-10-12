import { number } from "joi";
import {Document, model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import { IDialyMatchReport } from "./dialyMatchReport.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const dialyMatchReportSchema: Schema = new Schema<Document<IDialyMatchReport>>({
    ref: {type: String, default: ""},
    company: {type: String, default: ""},
    companyId: {type: ObjectId, required: true},
    action: {type: String, default: ""},
    actionDate: {type: Date, default: null},
    success: {type: String, default: ""},
    assetType: {type: String, default: ""},
    groupDate: {type: Date, default: null},
    reportLab: {type: String, default: ""},
    reportNumber: {type: String, default: ""},
    caratWeight: {type: Number, default: 0},
    shape: {type: String, default: ""},
    colorCategory: {type: String, default: ""},
    colorSubCategory: {type: String, default: ""},
    gradingColor: {type: String, default: ""},
    gradingShape: {type: String, default: ""},
    clarity: {type: String, default: ""},
    cut: {type: String, default: ""},
    value: {type: Number, default: 0},
    completion: {type: String, default: ""},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
},  {timestamps: {createdAt: true, updatedAt: false}, versionKey: false});

const dialyMatchReportModel = model<IDialyMatchReport>(TableName.DIALY_MATCH_REPORT, dialyMatchReportSchema);

export default dialyMatchReportModel