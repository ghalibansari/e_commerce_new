import {model, Schema} from "mongoose";
import {TableName} from "../../constants"
import {ISkuInfinityPrice} from "./sku-infinity-price.types";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const skuInfinityPriceSchema: Schema<ISkuInfinityPrice> = new Schema({
    skuId: {type: ObjectId, ref: TableName.SKU, required: true },
    price: {type: Number, required: true},
    // infinityPriceTotal: {type: Number, required: true, min: 0},
    totalPrice: {type: Number, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true },
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true },
}, {timestamps: true, versionKey: false});


const skuInfinityPriceModel = model<ISkuInfinityPrice>(TableName.SKU_INFINITY_PRICE, skuInfinityPriceSchema);

export default skuInfinityPriceModel
