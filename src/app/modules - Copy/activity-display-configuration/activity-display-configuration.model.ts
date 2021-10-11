import {Document, model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {IActivityDisplayConfigurationTypes} from "./activity-display-configuration.types";

const {Types: {ObjectId, String, Boolean}} = Schema

export const activityDisplayConfigurationSchema: Schema = new Schema<Document<IActivityDisplayConfigurationTypes>>({
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    roleId: {type: ObjectId, ref: TableName.ROLE, required: true},
    userId: {type: ObjectId, ref: TableName.USER},
    value: {type: String, required: true},
    sequence: {type: Number, default: null},
    preFix: {type: String, default: ""},
    postFix: {type: String, default: ""},
    //@ts-ignore    //Todo remove-this-line-ts-ignore
    alignment: {type: String, enum:['center', 'right', 'left', null], default: null},
    dbField: {type: String, default: ""},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const activityDisplayConfigurationModel = model<IActivityDisplayConfigurationTypes>(TableName.ACTIVITY_DISPLAY_CONFIGURATION, activityDisplayConfigurationSchema);

export default activityDisplayConfigurationModel