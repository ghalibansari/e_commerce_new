import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import { IStoneTypeMaster } from "./stone-type-master.types";
import {skuColorTypeEnum} from "../sku/sku.types";
const {Types: {ObjectId, String, Boolean}} = Schema


const stoneTypeMasterSchema: Schema<IStoneTypeMaster> = new Schema({
    type: {type: String, required: true, unique: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const stoneTypeMasterModel = model<IStoneTypeMaster>(TableName.STONE_TYPE_MASTER, stoneTypeMasterSchema);

export default stoneTypeMasterModel
