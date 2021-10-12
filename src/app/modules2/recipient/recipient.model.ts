import {model, Schema} from "mongoose";
import {IRecipient} from "./recipient.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean, Number}} = Schema


const recipientSchema: Schema<IRecipient> = new Schema({
    templateId: { type: ObjectId, ref: TableName.TEMPLATE },
    email: {type: String, required: true},
    type: {type: Number, required: true}, //1=cc,2=bcc,3=to
    isActive: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const recipientModel = model<IRecipient>(TableName.RECIPIENT, recipientSchema);

export default recipientModel