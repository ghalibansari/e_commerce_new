import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {IActivityHistory} from "./activity-history.types";

const {Types: {ObjectId, String, Boolean}} = Schema


const activityHistorySchema: Schema = new Schema({
    companyId: {type: ObjectId, ref: TableName.COMPANY , required: true},
    userId: {type: ObjectId, ref: TableName.USER , required: true},
    skuId: {type: ObjectId, ref: TableName.SKU , required: true},
    labsId: [{type: ObjectId, ref: TableName.LAB , required: true}],
    iavId: {type: ObjectId, ref: TableName.IAV, required: true},
    dmId: {type: ObjectId, ref: TableName.DIAMOND_MATCH, required: true },
    status: {type:String, required: true},
    comments:{type:String,required: false},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdAt: {type: Date, required: true},
    createdBy: {type: ObjectId, ref: TableName.USER,required: true},
    updatedAt: {type: Date, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

});

const activityHistoryModel = model<IActivityHistory>(TableName.ACTIVITY_HISTORY, activityHistorySchema);

export default activityHistoryModel;