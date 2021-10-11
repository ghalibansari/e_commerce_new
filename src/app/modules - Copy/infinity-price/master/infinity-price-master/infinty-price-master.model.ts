import {model, Schema} from "mongoose";
import {TableName} from "../../../../constants";
import {IInfinityPriceMaster} from "./infinity-price-master.types";
const {Types: {ObjectId, String, Boolean}} = Schema


const infinityPriceMasterSchema = new Schema<IInfinityPriceMaster>({
    caratRangeMasterId: {type: ObjectId, ref: TableName.CARAT_MASTER, required: true},
    colorMasterId: {type: ObjectId, ref: TableName.COLOR_MASTER, required: true},
    clarityMasterId: {type: ObjectId, ref: TableName.CLARITY_MASTER, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const infinityPriceMasterModel = model<IInfinityPriceMaster>(TableName.INFINITY_PRICE_MASTER, infinityPriceMasterSchema);

export default infinityPriceMasterModel