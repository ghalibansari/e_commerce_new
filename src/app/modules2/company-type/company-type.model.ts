import {model, Schema} from "mongoose";
import {ICompanyType} from "./company-type.types";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema


//user schema.
const companyTypeSchema: Schema<ICompanyType> = new Schema({
    code: {type: String, required: true},
    shortDescription: {type: String, required: true},
    longDescription: {type: String, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const companyTypeModel = model<ICompanyType>(TableName.COMPANY_TYPE, companyTypeSchema);

export default companyTypeModel