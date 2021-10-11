import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {IInfinityPrice} from './infinity-price.types'

const {Types: {ObjectId, String, Boolean}} = Schema

//Comments schema.
const infinityPriceSchema = new Schema<IInfinityPrice>({
    // shape: {type: String, required: true},
    // shapeCode: {type: String, required: true},
    stoneTypeId: {type: ObjectId, ref: TableName.STONE_TYPE_MASTER, required: true},
    //fluorescenseId: {type: ObjectId, ref: TableName.FLUORESCENSE_MASTER, required: true},
    clarityRangeId: {type: ObjectId, ref: TableName.CLARITY_RANGE, required: true},//
    colorRangeId: {type: ObjectId, ref: TableName.COLOR_RANGE, required: true}, // White ,  Off-white , Fancy//
    weightRangeId: {type: ObjectId, ref: TableName.CARAT_MASTER, required: true},
    price: {type: Number, required: true},
    effectiveDate: {type: Date, required: true},
    isDeleted: {type: Boolean, default: 0},
    isActive: {type: Boolean, required: true,default: 1},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false})

const infinityPriceModel = model<IInfinityPrice>(TableName.INFINITY_PRICE, infinityPriceSchema);

export {infinityPriceSchema}
export default infinityPriceModel
