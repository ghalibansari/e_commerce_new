import {model, Schema} from "mongoose";
import {IAddress} from "./address.types";
import {attributeSchema} from "../attribute/attribute.model";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const addressSchema: Schema<IAddress> = new Schema({
    address1: {type: String},
    address2: {type: String},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    zipCode: {type: String},
    attributes: [attributeSchema],
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
   //
}, {timestamps: true, versionKey: false});

const addressModel = model<IAddress>(TableName.ADDRESS, addressSchema);

export default addressModel;
export {addressSchema}