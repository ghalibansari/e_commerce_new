import {Document, model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import {ITransactionIav} from "./iav-change.types";

const {Types: {ObjectId, String, Boolean}} = Schema

const transactionIavChangeSchema: Schema = new Schema<Document<ITransactionIav>>({
    skuIds : [{type: ObjectId, ref: TableName.SKU}],
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    rapaportDate : {type: String, required: true},
    newIav: {type: Number},
    transactionId  : {type: String, unique: true , required: true},
    approvedBy: {type: ObjectId, ref: TableName.USER},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const transactionIavChangeModel = model<ITransactionIav>(TableName.TRANSACTION_IAV, transactionIavChangeSchema);

export default transactionIavChangeModel