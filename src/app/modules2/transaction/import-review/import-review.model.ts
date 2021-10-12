import {Document, model, Schema} from "mongoose";
import {TableName} from "../../../constants";
import {ITransactionImportReview} from "./import-review.types";

const {Types: {ObjectId, String, Boolean}} = Schema

const transactionImportReviewSchema: Schema = new Schema<Document<ITransactionImportReview>>({
    skuIds : [{type: ObjectId, ref: TableName.SKU}],
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    status: {type: String},
    transactionId  : {type: String,unique:true, required: true},
    approvedBy: {type: ObjectId, ref: TableName.USER},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const transactionImportReviewModel = model<ITransactionImportReview>(TableName.TRANSACTION_IMPORT_REVIEW, transactionImportReviewSchema);

export default transactionImportReviewModel