import {model, Schema} from "mongoose";
import {skuValue} from "../../model/SkuValueHistory";
import {commentSchema} from "../comment/comment.model";
import {ILogger, loggerLevelEnum} from "./logger.types";
import {modulesEnum, TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const loggerSchema: Schema<ILogger> = new Schema({
    url: String,
    method: String,
    query: String,
    body: String,
    // module: {type: String, enum: Object.keys(modulesEnum), required: true},  //Todo uncomment this line and add all module list in modulesEnum
    module: {type: String, required: true},
    level: {type: String, enum: Object.keys(loggerLevelEnum), required: true},
    message: {type: String, required: true},
    isDeleted: {type: Boolean, default: false},
    createdBy: {type: ObjectId, ref: TableName.USER, default: null},
    updatedBy: {type: ObjectId, ref: TableName.USER, default: null},
}, {timestamps: true, versionKey: false});

const loggerModel = model<ILogger>(TableName.LOGGER, loggerSchema);

export default loggerModel