import {model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import { IAlertType } from "./alert-type.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const AlertTypeSchema: Schema<IAlertType> = new Schema({
    type: {type: String, required: true},
    isActive:{type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const alertTypeModel = model<IAlertType>(TableName.ALERT_TYPE, AlertTypeSchema);

export default alertTypeModel