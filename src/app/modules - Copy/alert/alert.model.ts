import {model, Schema} from "mongoose";
import {IAlert, readStatusEnum, alertStatusEnum} from "./alert.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


//Todo create interface for this.
const AlertSchema: Schema<IAlert> = new Schema({
    userId: {type: ObjectId, ref: TableName.USER},
    alertId: {type: ObjectId, ref: TableName.ALERT_MASTER, required: true},
    skuId: {type:ObjectId, ref: TableName.SKU},     //Todo. this field required or not confirm with venkat
    companyId: {type: ObjectId, ref: TableName.COMPANY},
    message: {type: String, required: true},
    status: {type: String, enum: Object.values(alertStatusEnum), required:true},
    readStatus: {type: String, enum: Object.values(readStatusEnum), default: readStatusEnum.NOTVIEWED},
    isActive:{type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, default: null},
    updatedBy: {type: ObjectId, ref: TableName.USER, default: null},

}, {timestamps: true, versionKey: false});

const alertModel = model<IAlert>(TableName.ALERT, AlertSchema);

export default alertModel