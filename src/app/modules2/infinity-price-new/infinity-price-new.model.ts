import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {IInfinityPriceNew} from './infinity-price-new.types'
import {skuColorTypeEnum} from "../sku/sku.types";

const {Types: {ObjectId, String, Boolean}} = Schema

//Comments schema.
const infinityPriceSchemaNew = new Schema<IInfinityPriceNew>({
    infinityPriceMasterId: {type: ObjectId, ref: TableName.INFINITY_PRICE_MASTER, required: true},
    price: {type: Number, required: true},
    effectiveDate: {type: Date, required: true},
    stoneType: {type: String, required: true, enum: Object.values(skuColorTypeEnum)},
    isDeleted: {type: Boolean, default: 0},
    isActive: {type: Boolean, required: true,default: 1},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false})

const infinityPriceNewModel = model<IInfinityPriceNew>(TableName.INFINITY_PRICE_NEW, infinityPriceSchemaNew);

export {infinityPriceSchemaNew}
export default infinityPriceNewModel
