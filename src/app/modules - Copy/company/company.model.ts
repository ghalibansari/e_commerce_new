import {model, Schema} from "mongoose";
import {ICompany} from "./company.types";
import {contactSchema} from "../contact/contact.model";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema


const companySchema: Schema<ICompany> = new Schema({
    name: {type: String, required: true},
    addressId: {type: ObjectId, ref: TableName.ADDRESS, required: true},
    contacts: [contactSchema],  //Todo remove _id creation from contact nested schema.
    logoUrl: {type: String, required: true},
    companyTypeId: {type: ObjectId, ref: TableName.COMPANY_TYPE, required: true},
    companySubTypeId: {type: ObjectId, ref: TableName.COMPANY_SUB_TYPE, required: true},
    parentId: {type: ObjectId, ref: TableName.COMPANY, default: null},
    isDeleted: {type: Boolean, default: 0},
    isActive: {type: Boolean, required: true,default: 1},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const companyModel = model<ICompany>(TableName.COMPANY, companySchema);

export default companyModel;