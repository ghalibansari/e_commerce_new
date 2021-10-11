import {model, Schema, Document} from "mongoose";
import { IRawActivity } from "./raw-activity.types";
import { boolean } from "joi";
import { eventsSchema } from "../events/events.model";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean, Date}} = Schema


const rawActivitySchema = new Schema<Document<IRawActivity>>({
    reader : {
        serial : {type: String, required: true},
        drawer : {type: String, required: true}
    },
    user: {type: ObjectId, ref: TableName.USER},
    inCount: {type: Number, required:true},
    outCount: {type: Number, required:true},
    inventoryCount: {type: Number, required:true},
    transactionId: {type: String, required: true},
    companyId: {type: ObjectId, ref: TableName.COMPANY, required:true},
    deviceId:  {type: ObjectId, ref: TableName.DEVICE, required: true},
    timestamp : {type: Date, required: true},
    isTagValidated : {type: Boolean,default:false, required: true},
    isCountChecked : {type: Boolean,default:true, required: true},
    events : [eventsSchema],
    isActive:{type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const rawActivityModel = model<IRawActivity>(TableName.RAW_ACTIVITY, rawActivitySchema);

export default rawActivityModel;
export {rawActivitySchema}