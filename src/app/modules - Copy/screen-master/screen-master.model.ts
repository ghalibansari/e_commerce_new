import {Document, model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {IScreenMasterTypes} from "./screen-master.types";

const {Types: {ObjectId, String, Boolean}} = Schema

export const screenMasterSchema: Schema = new Schema<Document<IScreenMasterTypes>>({
    screen: {type: String, required: true, unique: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},

}, {timestamps: true, versionKey: false});

const screenMasterModel = model<IScreenMasterTypes>(TableName.SCREEN_MASTER, screenMasterSchema);

export default screenMasterModel