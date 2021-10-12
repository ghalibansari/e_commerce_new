import {model, Schema} from "mongoose";
import { boolean, string } from "joi";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


//Todo create interface for this.
const diamondMatchSchema: Schema<any> = new Schema({
    diamondMatchRuleId: {type: ObjectId, ref: TableName.DIAMOND_MATCH_RULE, default: null},
    skuId: {type:ObjectId, ref: TableName.SKU, required: true},
    status: {type: String, enum: ["MATCHED", "NOTMATCHED", "CANCELLED"], default:"NOTMATCHED"},
    dmType: {type: String, enum: ["AUTO", "MANUAL"], default: "MANUAL"},
    companyId: {type:ObjectId, ref: TableName.COMPANY, required: true},
    // deviceId: {type: ObjectId, ref: "Device", required: true},
    performedBy: {type: ObjectId, ref: TableName.USER,  default: null},
    comments: {type: String},
    actionType:{type: String, enum: ["MATCH", "MATCH_PER_GUID"]},
    foundDmGuid:{type: String},
    error: [{
        code: {type: String, default: ""},
        description: {type: String, default: ""},
        createdBy: {type: ObjectId, ref: TableName.USER, default: null},
        createdAt: {type: Date, required: true}
    },{_id: false}],
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, default: null},
    updatedBy: {type: ObjectId, ref: TableName.USER, default: null},

}, {timestamps: true, versionKey: false});

const diamondMatchModel = model<any>(TableName.DIAMOND_MATCH, diamondMatchSchema);

export default diamondMatchModel