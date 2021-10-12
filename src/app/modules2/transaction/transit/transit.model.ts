/*
import {Document, model, Schema} from "mongoose";
import { TableName } from "../../../constants";
import { ITransactionTransit } from "./transit.types";
const {Types: {ObjectId, String, Boolean}} = Schema

const transactionTransitSchema: Schema = new Schema<Document<ITransactionTransit>>({
    skuIds : [{type: ObjectId, ref: TableName.SKU}],
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    transactionId  : {type: String, unique: true , required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const transactionTransitModel = model<ITransactionTransit>(TableName.TRANSACTION_TRANSIT, transactionTransitSchema);

export default transactionTransitModel*/
