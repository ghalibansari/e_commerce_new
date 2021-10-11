import {model, Schema} from "mongoose";
import {TableName} from "../../constants"
import {ILoanHistory} from "./loan-history.types";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const loanHistorySchema: Schema<ILoanHistory> = new Schema({
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true },
    amount: {type: Number, required: true, min: 0},
    infinityCollateral: {type: Number, min: 0, default: null},
    clientCollateral: {type: Number, min: 0, default: null},
    collateralShortfall: {type: Number, min: 0, default: null},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true },
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true },
}, {timestamps: true, versionKey: false});


const loanHistoryModel = model<ILoanHistory>(TableName.LOAN_HISTORY, loanHistorySchema);

export default loanHistoryModel