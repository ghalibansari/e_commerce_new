import {model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import { IAlertLevel } from "./alert-level.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const AlertLevelSchema: Schema<IAlertLevel> = new Schema({
    level: {type: String, required: true},
    isActive:{type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const alertLevelModel = model<IAlertLevel>(TableName.ALERT_LEVEL, AlertLevelSchema);

export default alertLevelModel