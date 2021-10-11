import {Document, model, Schema} from "mongoose";
import {IContact} from "./contact.types";
import {Regex, TableName} from "../../constants";
import { string } from "joi";
const {Types: {ObjectId, String, Boolean, Number}} = Schema


const contactSchema: Schema = new Schema<Document<IContact>>({
    name: {type: String, required: true},
    number: {type: String, required: true},
    primaryCode: {type: String, required: true},
    // number: {type: String, trim: true, unique: true, maxlength: 10, minlength: 10, match: new RegExp(Regex.phoneNumber), required: true},    //Todo fix this number
    email: {type: String, unique: true, required: true},
    jobDescription: {type: String, required: true, lowercase: true},
    altNumber: {type: String},
    secondaryCode: {type: String},
    //countryCode: {type: String, required: true},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const contactModel = model<IContact>(TableName.CONTACT, contactSchema)
export default contactModel

export {contactSchema}