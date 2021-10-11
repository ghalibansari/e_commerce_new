import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import { IDiamondRegistration } from "./diamond-registration.types";
const {Types: {ObjectId, String, Boolean}} = Schema


//Todo create interface for this.
const diamondRegistrationSchema: Schema<IDiamondRegistration> = new Schema({
    skuId: {type:ObjectId, ref: TableName.SKU, required: true},
    dmGuid: {type: String, required: true},
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    action: {type: String,  enum: ['REGISTRATION', 'ALTER_REGISTRATION'], required: true},  //Todo convert all enum to typescript enum...
    error: {
        code: {type: String, default: ""},
        description: {type: String, default: ""},
        createdBy: {type: ObjectId, ref: TableName.USER, default: null},
        createdAt: {type: Date, default: null}
    },
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    status: {type: String, required: true},
    createdBy: {type: ObjectId, ref: TableName.USER, default: null},
    updatedBy: {type: ObjectId, ref: TableName.USER, default: null},
}, {timestamps: true, versionKey: false});

const diamondRegistrationModel = model<IDiamondRegistration>(TableName.DIAMOND_REGISTRATION, diamondRegistrationSchema);

export default diamondRegistrationModel