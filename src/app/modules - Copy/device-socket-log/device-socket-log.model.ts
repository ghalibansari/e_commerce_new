import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import { IDeviceSocketLog } from "./device-socket-log.types";
const {Types: {ObjectId, String, Boolean}} = Schema


//Todo create interface for this.
const deviceSocketLogSchema: Schema<IDeviceSocketLog> = new Schema({
    deviceId: {type: ObjectId, ref: TableName.DEVICE, default: null},
    eventName: {type: String, required: true},
    eventBody: {type: String, required: true},
    createdBy: {type: ObjectId, ref: TableName.USER, default:null}
}, {timestamps: true, versionKey: false});

const deviceSocketLogModel = model<IDeviceSocketLog>(TableName.DEVICE_SOCKET_LOG, deviceSocketLogSchema);

export default deviceSocketLogModel