import { number } from "joi";
import {model, Schema} from "mongoose";
import {TableName} from "../../../../constants";
import { IColorMaster } from "./color-master.types";
const {Types: {ObjectId, String, Boolean}} = Schema


//Todo create interface for this.
const colorMasterSchema: Schema<IColorMaster> = new Schema({
    color: {type: String, required: true},
    // code: {type: Number, unique: true, required: true, min: 0},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const colorMasterModel = model<IColorMaster>(TableName.COLOR_MASTER, colorMasterSchema);

export default colorMasterModel