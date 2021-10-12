import {model, Schema, Document} from "mongoose";
import {TableName} from "../../../constants";
import {ITransactionConsignment} from "./consignment.types";

const {Types: {ObjectId, String, Boolean}} = Schema

const transactionConsignmentSchema: Schema = new Schema<Document<ITransactionConsignment>>({
    skuIds : [{type: ObjectId, ref: TableName.SKU}],
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    // rapaportDate : {type: String, required: true},
    transactionId  : {type: String, unique: true , required: true},
    status : {type: String, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    approvedBy: {type: ObjectId, ref: TableName.USER},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const transactionConsignmentModel = model<ITransactionConsignment>(TableName.TRANSACTION_CONSIGNMETNT, transactionConsignmentSchema);

export default transactionConsignmentModel