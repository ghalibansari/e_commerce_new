import {model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import { IAlertSubCategory } from "./alert-sub-category.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const AlertSubCategorySchema: Schema<IAlertSubCategory> = new Schema({
    alertCategoryId: {type: ObjectId, ref: TableName.ALERT_CATEGORY, required: true},
    subCategory: {type: String, required: true, unique: true},
    isActive:{type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const alertSubCategoryModel = model<IAlertSubCategory>(TableName.ALERT_SUB_CATEGORY, AlertSubCategorySchema);

export default alertSubCategoryModel