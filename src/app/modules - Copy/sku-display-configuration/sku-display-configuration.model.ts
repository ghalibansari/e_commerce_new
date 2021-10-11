import {Document, model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {ISkuDisplayConfigurationTypes} from "./sku-display-configuration.types";

const {Types: {ObjectId, String, Boolean}} = Schema

export const skuDisplayConfigurationSchema: Schema = new Schema<Document<ISkuDisplayConfigurationTypes>>({
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    roleId: {type: ObjectId, ref: TableName.ROLE, required: true},
    userId: {type: ObjectId, ref: TableName.USER},
    text: {type: String, required: true},
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

const skuDisplayConfigurationModel = model<ISkuDisplayConfigurationTypes>(TableName.SKU_DISPLAY_CONFIGURATION, skuDisplayConfigurationSchema);

export default skuDisplayConfigurationModel
