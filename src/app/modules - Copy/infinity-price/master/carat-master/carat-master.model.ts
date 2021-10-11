import { number } from "joi";
import {model, Schema} from "mongoose";
import {TableName} from "../../../../constants";
import { ICaratMaster } from "./carat-master.types";
const {Types: {ObjectId, String, Boolean}} = Schema


//Todo create interface for this.
const caratMasterSchema: Schema<ICaratMaster> = new Schema({
    fromCarat: {type: Number, required: true},
    toCarat: {type: Number, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const caratMasterModel = model<ICaratMaster>(TableName.CARAT_MASTER, caratMasterSchema);

export default caratMasterModel