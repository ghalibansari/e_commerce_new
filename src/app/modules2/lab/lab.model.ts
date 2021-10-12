import {model, Schema} from "mongoose";
import type {ILab} from "./lab.types";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const lsbSchema: Schema<ILab> = new Schema({
    lab: {type: String, required: true},
    labReportId: {type: String, required: true},
    labReportPath: {type: String, required: false, allow: null},
    labReportDate: {type: Date, required: false, allow: null},
    isDeleted: {type: Boolean, default: false},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const labModel = model<ILab>(TableName.LAB, lsbSchema);

export default labModel