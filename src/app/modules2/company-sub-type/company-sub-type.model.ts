import {model, Schema} from "mongoose";
import {ICompanySubType} from "./company-sub-type.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


const companySubTypeSchema: Schema<ICompanySubType> = new Schema({
    code: {type: String},
    shortDescription: {type: String},
    longDescription: {type: String},
    companyTypeId: {type: ObjectId, ref: TableName.COMPANY_TYPE},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},   //Todo add everywhere createdBy and updatedBy required true or not
    updatedBy: {type: ObjectId, ref: TableName.USER},

}, {timestamps: true, versionKey: false});

const companySubTypeModel = model<ICompanySubType>(TableName.COMPANY_SUB_TYPE, companySubTypeSchema);

export default companySubTypeModel