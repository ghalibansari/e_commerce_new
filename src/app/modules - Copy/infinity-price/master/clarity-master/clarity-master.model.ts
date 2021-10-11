import { number } from "joi";
import {model, Schema} from "mongoose";
import {TableName} from "../../../../constants";
import { IClarityMaster } from "./clarity-master.types";
const {Types: {ObjectId, String, Boolean, Number}} = Schema


//Todo create interface for this.
const clarityMasterSchema: Schema<IClarityMaster> = new Schema({
    clarity: {type: String, required: true},
    // code: {type: Number, unique: true, required: true, min: 0},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const clarityMasterModel = model<IClarityMaster>(TableName.CLARITY_MASTER, clarityMasterSchema);

export default clarityMasterModel