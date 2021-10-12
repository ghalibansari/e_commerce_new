import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import { IUserAlerts } from "./user-alert.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const UserAlertSchema: Schema<IUserAlerts> = new Schema({
    level: {type: String, required: true},
    userIds: [{type: ObjectId, ref: TableName.USER, required: true}],
    message: {type: String, required: true},
    isActive:{type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const userAlertModel = model<IUserAlerts>(TableName.USER_ALERTS, UserAlertSchema);

export default userAlertModel