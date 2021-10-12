import {model, Schema} from "mongoose";
import {ITemplate} from "./template.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean, Number}} = Schema

//Todo implement interface
const templateSchema: Schema<ITemplate> = new Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    subject: {type: String, required: true},
    body: {type: String, required: true},
    params: {type: String, required: true},
    type: {type: Number, default: 1, enum:[1,2]},  //1=email,2=sms
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const templateModel = model<ITemplate>(TableName.TEMPLATE, templateSchema);

export default templateModel;