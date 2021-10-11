import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import { ILabMaster } from "./lab-master.types";
const {Types: {ObjectId, String, Boolean}} = Schema


const labMasterSchema: Schema<ILabMaster> = new Schema({
    labType: {type: String, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const labMasterModel = model<ILabMaster>(TableName.LAB_MASTER, labMasterSchema);

export default labMasterModel