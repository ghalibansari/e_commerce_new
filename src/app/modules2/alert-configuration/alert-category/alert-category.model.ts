import {model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import { IAlertCategory } from "./alert-category.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const AlertCategorySchema: Schema<IAlertCategory> = new Schema({
    category: {type: String, required: true, unique: true},
    isActive:{type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const alertCategoryModel = model<IAlertCategory>(TableName.ALERT_CATEGORY, AlertCategorySchema);

export default alertCategoryModel