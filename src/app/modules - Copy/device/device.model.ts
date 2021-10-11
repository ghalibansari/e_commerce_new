import {model, Schema} from "mongoose";
import {IDevice} from "./device.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


//user schema.
const deviceSchema: Schema<IDevice> = new Schema({
    name: { type: String, required: true },
    companyId: { type: ObjectId, ref: TableName.COMPANY, required: true },
    serialNumber: { type: String, unique: true, required: true },
    description: { type: String},
    token: {type: String, default: null},
    userIds: [{type:ObjectId, ref:  TableName.USER }],
    deviceTypeId: { type: ObjectId, ref: TableName.DEVICE_TYPE, required: true },
    isActive: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: 0 },
    createdBy: { type: ObjectId, ref: TableName.USER, required: true },
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const deviceModel = model<IDevice>(TableName.DEVICE, deviceSchema);

export default deviceModel