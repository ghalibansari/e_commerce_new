import {model, Schema} from "mongoose";
import {addressSchema} from "../address/address.model";
import {IMovementActivity} from "./movement-activity.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


//user schema.
const movementActivitySchema: Schema<IMovementActivity> = new Schema({
    skuId: {type: ObjectId, ref: TableName.SKU},
    companyId: {type: ObjectId, ref: TableName.COMPANY},
    deviceTypeId: {type: ObjectId, ref: TableName.DEVICE_TYPE},
    dmId: {type: String},
    actionType: {type: String, required: true, enum:
            ['INVENTORY', 'ALERT', 'IN', 'OUT', 'APPROVED', 'FINGERPRINT', 'ARRIVAL', 'OPENBIZ', 'CLOSEBIZ',
            'SOLD', 'VAULT', 'MISSING', 'RESTART', 'RETURN', 'PING', 'OPERATIONAL', 'STANDBY', "TRANSIT"]},
    actionOpenIp: {type: String, required: true},
    actionCloseIp: {type: String},
    toDate: {type: String, default: null},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const movementActivityModel = model<IMovementActivity>(TableName.MOVEMENT_ACTIVITY, movementActivitySchema);

export default movementActivityModel