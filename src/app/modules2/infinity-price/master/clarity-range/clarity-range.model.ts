import { number } from "joi";
import {model, Schema} from "mongoose";
import {TableName} from "../../../../constants";
import { IClarityRange } from "./clarity-range.types";
const {Types: {ObjectId, String, Boolean}} = Schema


//Todo create interface for this.
const clarityRangeSchema: Schema<IClarityRange> = new Schema({
    fromClarity: {type: Number, required: true},
    toClarity: {type: Number, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const clarityRangeModel = model<IClarityRange>(TableName.CLARITY_RANGE, clarityRangeSchema);

export default clarityRangeModel