import {model, Schema} from "mongoose";
import { IDeviceType } from "./device-type.types";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema


//user schema.
const deviceTypeSchema: Schema<IDeviceType> = new Schema({
    code: {type: String, required: true},
    shortDescription: {type: String, required: true},
    longDescription: {type: String, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const deviceTypeModel = model<IDeviceType>(TableName.DEVICE_TYPE, deviceTypeSchema);

export default deviceTypeModel