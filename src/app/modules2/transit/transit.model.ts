import {Document, model, Schema} from "mongoose";
import {commentSchema} from "../comment/comment.model";
import {ITransit, ITransitStatusEnum} from "./transit.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean, }} = Schema


//Todo create interface for this.
const transitSchema: Schema = new Schema<Document<ITransit>>({
    skuIds: [{type: ObjectId, ref: TableName.SKU, required: true}],
    comments: [commentSchema],
    transitTime: {type: Date, required: true},
    returnTime: {type: Date},
    status: {type: String, enum: Object.values(ITransitStatusEnum), default: ITransitStatusEnum.INITIATED},
    isSchedule: { type: Boolean, default: 0 },
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    schedule: {
        sendOn: { type: String},
        returnHrs: { type: String},
        returnType: { type: String}
    },
    // time: {type: Date, required: true},
    // from: {type: ObjectId, ref: 'Address', required: true},
    // to: {type: ObjectId, ref: 'Address', required: true},
    // statusId: {type: ObjectId, ref: 'Status', required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
   //
}, {timestamps: true, versionKey: false});

const transitModel = model<ITransit>(TableName.TRANSIT, transitSchema);

export default transitModel