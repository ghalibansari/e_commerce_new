import {model, Schema} from "mongoose";
import {iavStatusEnum, IIav} from "./iav.types";
import {TableName} from "../../constants";
import { string } from "joi";

const {Types: {ObjectId, String, Boolean}} = Schema


const iavSchema = new Schema<IIav>({
    iav: {type: Number, default: 0},
    iavAverage: {type: Number, default: 0},
    skuId: {type: ObjectId, ref: TableName.SKU, required: true },
    rapPriceId: {type: ObjectId, ref : TableName.RAP_PRICE},
    clientPriceId: {type: ObjectId, ref: TableName.CLIENT_PRICE},
    drv: {type: Number, required: true },
    pwv: {type: Number, required: true },
    status: {type: String, default: iavStatusEnum.APPROVED, enum: Object.values(iavStatusEnum)},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    effectiveDate: {type: Date, default: null},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const iavModel = model<IIav>(TableName.IAV, iavSchema);

export default iavModel