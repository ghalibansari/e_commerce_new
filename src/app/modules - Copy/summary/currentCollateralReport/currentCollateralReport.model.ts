import { number } from "joi";
import {Document, model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import { ICurrentCollateralReport } from "./currentCollateralReport.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const CurrentCollateralReportSchema: Schema = new Schema<Document<ICurrentCollateralReport>>({
    company: {type: String, default: ""},
    companyId: {type: ObjectId, required: true},
    ref: {type: String, default: ""},
    reportLab: {type: String, default: ""},
    reportDate: {type: Date, default: null},
    reportNumber: {type: String, default: ""},
    shape: {type: String, default: ""},
    colorCategory: {type: String, default: ""},
    colorSubCategory:{type: String, default: ""},
    caratWeight: {type: Number, default: 0},
    gradingColor:{type: String, default: ""},
    gradingShape:{type: String, default: ""},
    clarity: {type: String, default: ""},
    cut: {type: String, default: ""},
    vc: {type: Number, default: 0},
    drv: {type: Number, default: 0},
    iav: {type: Number, default: 0},
    pwv: {type: Number, default: 0},
    lastDiamondMatch: {type: Date, default: null},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
},  {timestamps: {createdAt: true, updatedAt: false}, versionKey: false});

const CurrentCollateralReportModel = model<ICurrentCollateralReport>(TableName.CURRENT_COLLATERAL_REPORT, CurrentCollateralReportSchema);

export default CurrentCollateralReportModel