import {Document, model, Schema} from "mongoose";
import {IStatus} from "./status.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema

const statusSchema: Schema = new Schema<Document<IStatus>>({
    code: {type: String},
    description: {type: String},
    type: {type: String},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},

}, {timestamps: true, versionKey: false});

const statusModel = model<IStatus>(TableName.STATUS, statusSchema);

export default statusModel