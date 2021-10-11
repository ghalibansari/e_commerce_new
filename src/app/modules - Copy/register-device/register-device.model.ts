import {model, Schema, Document} from "mongoose";
import {TableName} from "../../constants";
import { IRegisterDevice } from "./register-device.types";
const {Types: {ObjectId, String, Boolean, Number}} = Schema


//user schema.
const registerDeviceSchema: Schema = new Schema<Document<IRegisterDevice>>({
    serialNumber: {type: String, required: true},
    token: {type: String, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const registerDeviceModel = model<IRegisterDevice>(TableName.REGISTER_DEVICE, registerDeviceSchema);

export default registerDeviceModel