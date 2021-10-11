import {model, Schema} from "mongoose";
import { TableName } from "../../constants"
import { IRapNetPrice } from "./rap-net-price.types";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const rapNetPriceSchema: Schema<IRapNetPrice> = new Schema({
    shape: {type: String, required: true},
    clarity: {type: String, required: true},
    color: {type: String, required: true},
    rapList: {type: Number, required: true},
    rapNetDiscount: {type: Number, default: 0},
    rapNetBestPriceDiscount: {type: Number, default: 0},
    rapNetAvgPriceDiscount: {type: Number, default: 0},
    rapNetBestPrice: {type: Number, default: 0},
    rapNetAvgPrice: {type: Number, default: 0},
    weight: {type: Number, required: true},
    weightRange: {type: {fromWeight: Number, toWeight:Number}, required: true},
    price: {type: Number, required: true},
    effectiveDate: {type: Date, required: true},
    rapNetDate: {type: Date, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});


const rapNetPriceModel = model<IRapNetPrice>(TableName.RAP_NET_PRICE, rapNetPriceSchema);

export default rapNetPriceModel
