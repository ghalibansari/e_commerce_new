import {model, Schema} from "mongoose";
import { IClientPrice } from "./client-price.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean, Number}} = Schema


const clientPriceSchema: Schema<IClientPrice> = new Schema({
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    skuId: {type: ObjectId, ref: TableName.SKU, required: true},
    shape: {type: String, required: true},
    clarity: {type: String, required: true},
    color: {type: String, required: true}, // White ,  Off-white , Fancy
    weight: {type: Number, required: true},
    price: {type: Number, required: true},
    stoneTypeId: {type: ObjectId, ref: TableName.STONE_TYPE_MASTER},
    status: {type: String, default: "PENDING", enum: ['PENDING','APPROVED','REJECTED']},
    pwvImport: {type: Number, required: true},
    effectiveDate: {type: String},
    createdBy: {type: String, required: true},
    updatedBy: {type: String, required: true},
}, {timestamps: true, versionKey: false});  //Todo added isDeleted column in this model


const clientPriceModel = model<IClientPrice>(TableName.CLIENT_PRICE, clientPriceSchema);

export default clientPriceModel