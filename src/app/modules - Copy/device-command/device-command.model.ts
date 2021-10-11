import { model, Schema } from "mongoose";
import { IDeviceCommand } from "./device-command.types";
import { TableName } from "../../constants";

const { Types: { ObjectId, String, Boolean } } = Schema


//user schema.
const deviceCommandSchema: Schema<IDeviceCommand> = new Schema({
    command: { type: String, required: true },
    deviceId: { type: ObjectId, ref: TableName.DEVICE, required: true },
    companyId: { type: ObjectId, ref: TableName.COMPANY, required: true },
    isActive: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: 0 },
    createdBy: { type: ObjectId, ref: TableName.USER },
    updatedBy: { type: ObjectId, ref: TableName.USER },

}, { timestamps: true });

const deviceCommandModel = model<IDeviceCommand>(TableName.DEVICE_COMMAND, deviceCommandSchema);

export default deviceCommandModel