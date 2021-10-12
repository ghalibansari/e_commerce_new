import {model, Schema} from "mongoose";
import { IVerification } from "./verification.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema

const VerificationSchema: Schema<IVerification> = new Schema({
    // userId: {type: ObjectId, ref: TableName.USER },
    otp: {type: String, required: true },
    messageId: {type: String},
    type: {type: String},
    operation: {type: String, required: true },
    module:{type:String},
    data:{type:String},
    ip: {type: String, required: true},
    // isVerified: {type: Boolean, default: 0 },
    // isActive: {type: Boolean, default: 1 },
    // isDeleted: {type: Boolean, default: 0 },
    // createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    // updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true });

const verificationModel = model<IVerification>(TableName.VERIFICATION, VerificationSchema);

export default verificationModel