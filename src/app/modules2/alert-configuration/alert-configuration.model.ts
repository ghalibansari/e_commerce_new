import { string } from "joi";
import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import { IAlertConfiguration } from "./alert-configuration.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const AlertConfigurationSchema: Schema<IAlertConfiguration> = new Schema({
    category: {type: ObjectId, ref: TableName.ALERT_CATEGORY, required: true},
    subCategory: {type: ObjectId, ref: TableName.ALERT_SUB_CATEGORY, required: true},
    type: [{type: ObjectId, ref: TableName.ALERT_TYPE, required: true}],
    level: {type: ObjectId, ref: TableName.ALERT_LEVEL, required: true},
    reciever: [{type: ObjectId, ref: TableName.USER, required: true}],
    cc: [{type: ObjectId, ref: TableName.USER}],
    frequency: {type: String, default: null},
    schedule: [{type: String}],
    scheduleTime: {type: String, default: null},
    message: {type: String, required: true},
    isActive:{type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    runTime: {type: Date, default: null},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const alertConfigurationModel = model<IAlertConfiguration>(TableName.ALERT_CONFIGURATION, AlertConfigurationSchema);

export default alertConfigurationModel