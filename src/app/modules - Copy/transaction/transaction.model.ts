import {Document, model, Schema} from "mongoose";
import { ITransaction } from "./transaction.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema

const transactionSchema: Schema = new Schema<Document<ITransaction>>({
    // userIds : [{type: ObjectId, ref: "User"}],
    skuIds : [{type: ObjectId, ref: TableName.SKU}],
    newIav : {type: Number},
    rapaportDate : {type: String},
    transactionType : {type: String, required: true},
    status: {type: String,required: true},
    transactionId  : {type: String, unique: true , required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const transactionModel = model<ITransaction>(TableName.TRANSACTION, transactionSchema);

export default transactionModel