import { number } from "joi";
import {Document, model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import { IDiamondMatchSheetReport } from "./diamondMatchReport.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const diamondMatchReportSchema: Schema = new Schema<Document<IDiamondMatchSheetReport>>({
    matchDate: {type: Date, default: null},
    ref: {type: String, default: ""},
    reportLab: {type: String, default: ""},
    reportNumber: {type: String, default: ""},
    caratWeight: {type: Number, default: 0},
    companyId: {type: ObjectId, required: true},
    shape: {type: String, default: ""},
    colorCategory: {type: String, default: ""},
    colorSubCategory: {type: String, default: ""},
    gradeReportColor: {type: String, default: ""},
    clarity: {type: String, default: ""},
    cut: {type: String, default: ""},
    value: {type: Number, default: 0},
    typeOfDiamondMatch: {type: String, default: ""},
    action: {type: String, default: ""},
    success: {type: String, default: ""},
    message: {type: String, default: ""},
    MatchLocation: {type: String, default: ""},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
},  {timestamps: {createdAt: true, updatedAt: false}, versionKey: false});

const diamondMatchReportModel = model<IDiamondMatchSheetReport>(TableName.DIAMOND_MATCH_REPORT, diamondMatchReportSchema);

export default diamondMatchReportModel