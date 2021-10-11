import {model, Schema} from "mongoose";
import {IFileUploadHistory} from "./file-upload-history.types";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema

const fileUploadHistorySchema: Schema<IFileUploadHistory> = new Schema({
    fileName: {type: String, required: true},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const fileUploadHistoryModel = model<IFileUploadHistory>(TableName.FILE_UPLOAD_HISTORY, fileUploadHistorySchema);

export default fileUploadHistoryModel