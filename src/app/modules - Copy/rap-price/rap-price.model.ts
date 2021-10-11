import {model, Schema} from "mongoose";
import companySubTypeModel from "../company-sub-type/company-sub-type.model";
import {IRapPrice} from "./rap-price.types";
import { TableName } from "../../constants"
import {skuColorTypeEnum} from "../sku/sku.types";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const rapPriceSchema: Schema<IRapPrice> = new Schema({
    shape: {type: String, required: true},
    shapeCode: {type: String, required: true},
    clarity: {type: String, required: true},
    color: {type: String, required: true}, // White ,  Off-white , Fancy
    weightRange: {type: {fromWeight: Number, toWeight:Number}, required: true},
    price: {type: Number, required: true},
    effectiveDate: {type: String, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: String, required: true},
    updatedBy: {type: String, required: true},
}, {timestamps: true, versionKey: false});


const rapPriceModel = model<IRapPrice>(TableName.RAP_PRICE, rapPriceSchema);

export default rapPriceModel