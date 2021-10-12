import {model, Schema} from "mongoose";
import {TableName} from "../../constants"
import {ILoan} from "./loan.types";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const loanSchema: Schema<ILoan> = new Schema({  //Todo use decimal128 to omit dot precise point error in money calculation.
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


const loanModel = model<ILoan>(TableName.LOAN, loanSchema);

export default loanModel