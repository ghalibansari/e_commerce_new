import {model, Schema} from "mongoose";
import {TableName} from "../../../../constants";
import { IFluorescenseMaster } from "./fluorescense-master.types";
const {Types: {ObjectId, String, Boolean}} = Schema


const fluorscenseMasterSchema: Schema<IFluorescenseMaster> = new Schema({
    fluorescense: {type: String, required: true, unique: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const fluorscenseMasterModel = model<IFluorescenseMaster>(TableName.FLUORESCENSE_MASTER, fluorscenseMasterSchema);

export default fluorscenseMasterModel
