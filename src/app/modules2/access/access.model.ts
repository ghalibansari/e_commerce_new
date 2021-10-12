import {model, Schema, Document} from "mongoose";
import {TableName} from "../../constants";
import { IAccess } from "./access.types";

const {Types: {ObjectId, String, Boolean}} = Schema

const accessSchema: Schema<IAccess> = new Schema({
    roleId: {type: ObjectId, ref: TableName.ROLE},
    userId: {type: ObjectId, ref: TableName.USER},
    module: [{type: Object, required: true}],
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const accessModel = model<IAccess>(TableName.ACCESS, accessSchema);

export default accessModel