import {Document, model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import {ITransactionSale} from "./sale.types";

const {Types: {ObjectId, String, Boolean}} = Schema

const transactionSaleSchema: Schema = new Schema<Document<ITransactionSale>>({
    skuIds : [{type: ObjectId, ref: TableName.SKU}],
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    transactionId  : {type: String, unique: true , required: true},
    status : {type: String, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    approvedBy: {type: ObjectId, ref: TableName.USER},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const transactionSaleModel = model<ITransactionSale>(TableName.TRANSACTION_SALE, transactionSaleSchema);

export default transactionSaleModel