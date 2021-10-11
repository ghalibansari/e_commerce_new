import {Document, model, Schema} from "mongoose";
import {ITransactionImport} from "./import.types";
import {TableName} from "../../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema

const transactionImportSchema: Schema = new Schema<Document<ITransactionImport>>({
    skuIds : [{type: ObjectId, ref: TableName.SKU}],
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    fileName: {type: String},
    // rapaportDate : {type: String, required: true},
    totalStones: {type: Number, required: true},
    importedStones: {type: Number, required: true},
    notImportedStones: {type: Number, required: true},
    // approvedStones: {type: Number, default: 0},
    // rejectedStones: {type: Number, default: 0},
    // pendingReviewStones: {type: Number,default: 0},
    // priceChangedStones: {type: Number, default: 0},
    // readyCollateralStones: {type: Number, default: 0},
    // collateralStones: {type: Number, default: 0},
    status: {type: String,required: true},
    transactionId  : {type: String, unique: true , required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    approvedBy: {type: ObjectId, ref: TableName.USER},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const transactionImportModel = model<ITransactionImport>(TableName.TRANSACTION_IMPORT, transactionImportSchema);

export default transactionImportModel