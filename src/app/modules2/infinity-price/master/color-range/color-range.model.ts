import { number } from "joi";
import {model, Schema} from "mongoose";
import {TableName} from "../../../../constants";
import { IColorRange } from "./color-range.types";
const {Types: {ObjectId, String, Boolean}} = Schema


//Todo create interface for this.
const colorRangeSchema: Schema<IColorRange> = new Schema({
    fromColor: {type: Number, required: true},
    toColor: {type: Number, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const colorRangeModel = model<IColorRange>(TableName.COLOR_RANGE, colorRangeSchema);

export default colorRangeModel