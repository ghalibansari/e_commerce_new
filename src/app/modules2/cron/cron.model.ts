import {model, Schema} from "mongoose";
import {cronName, ICron} from "./cron.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


//user schema.
const cronSchema: Schema<ICron> = new Schema({
    name: {type: String, required: true, unique: true, enum: Object.values(cronName)},
    time: {type: String, required: true},
    days: {type: String, default: 90},
    lastRunTime: {type: Date, default: null},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const cronModel = model<ICron>(TableName.CRON, cronSchema);

export default cronModel