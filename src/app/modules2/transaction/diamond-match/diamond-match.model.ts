import {model, Schema, Document} from "mongoose";
import { TableName } from "../../../constants";
import { ITransactionDm } from "./diamond-match.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const transactionDmSchema: Schema = new Schema<Document<ITransactionDm>>({
    skuIds : [{type: ObjectId, ref: TableName.SKU}],
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    transactionId  : {type: String, unique: true , required: true},
    status : {type: String, required: true, default:"PENDING"},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const transactionDmModel = model<ITransactionDm>(TableName.TRANSACTION_DIAMOND_MATCH, transactionDmSchema);

export default transactionDmModel