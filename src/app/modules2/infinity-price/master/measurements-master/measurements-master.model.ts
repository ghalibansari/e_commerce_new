import {model, Schema} from "mongoose";
import {TableName} from "../../../../constants";
import { IMeasurementsMaster } from "./measurements-master.types";
const {Types: {ObjectId, String, Boolean}} = Schema


const measurementsMasterSchema: Schema<IMeasurementsMaster> = new Schema({
    length: {type: Number, required: true},
    bredth: {type: Number, required: true},
    width: {type: Number, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const measurementsMasterModel = model<IMeasurementsMaster>(TableName.MEASUREMENT_MASTER, measurementsMasterSchema);

export default measurementsMasterModel