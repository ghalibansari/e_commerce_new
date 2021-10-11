import { model, Schema } from "mongoose";
import { IDeviceLog } from "./device-log.types";
import { TableName } from "../../constants";

const { Types: { ObjectId, String, Boolean } } = Schema


//user schema.
const deviceLogSchema: Schema<IDeviceLog> = new Schema({
    deviceLog: { type: Object, required: true },
    deviceId: { type: ObjectId, ref: TableName.DEVICE, required: true },
    companyId: { type: ObjectId, ref: TableName.COMPANY, required: true },
    isActive: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: 0 },
    createdBy: { type: ObjectId, ref: TableName.USER, required: true },
    updatedBy: { type: ObjectId, ref: TableName.USER, required: true },
}, { timestamps: true });

const deviceLogModel = model<IDeviceLog>(TableName.DEVICE_LOG, deviceLogSchema);

export default deviceLogModel