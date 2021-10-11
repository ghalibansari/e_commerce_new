import {model, Schema} from "mongoose";
import { IAlertMaster } from "./alert-master.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


//Todo create interface for this.
const alertMasterSchema: Schema<IAlertMaster> = new Schema({
    code: {type: String, required: true},
    description: {type: String, required: true},
    priority: {type: String,enum: ['HIGH', 'MEDIUM', 'LOW'], required: true},//1 read, 0 unread
    alertType: {type: String, enum:['USERGENERATED' , 'SYSTEMGENERATED'], required: true},  //Todo move this enum's in type file
    status: {type: String, required: true},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const alertMasterModel = model<IAlertMaster>(TableName.ALERT_MASTER, alertMasterSchema);

export default alertMasterModel