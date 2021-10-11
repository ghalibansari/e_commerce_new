import {model, Schema} from "mongoose";
import { IActivity } from "./activity.types";
import { string, number } from "joi";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


const activitySchema: Schema = new Schema({
    companyId: {type: ObjectId, ref: TableName.COMPANY , required: true},
    userId: {type: ObjectId, ref: TableName.USER}, // What is the use of this userId
    skuId: {type: ObjectId, ref: TableName.SKU , required: true},
    labsId: [{type: ObjectId, ref: TableName.LAB , required: true}],
    iavId: {type: ObjectId, ref: TableName.IAV, required: true},
    dmId: {type: ObjectId, ref: TableName.DIAMOND_MATCH },
    status: {type:String, required: true},  //Todo make status as enum type.
    comments:{type:String,required: false},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, default: null},
    updatedBy: {type: ObjectId, ref: TableName.USER, default : null},

}, {timestamps: true, versionKey: false});

const activityModel = model<IActivity>(TableName.ACTIVITY, activitySchema);

export default activityModel