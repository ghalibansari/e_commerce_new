import {Document, model, Schema} from "mongoose";
import {IRfid} from "./rfid.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean, Number}} = Schema


//user schema.
const rfidSchema: Schema = new Schema<Document<IRfid>>({
    skuId: {type: ObjectId, required: true,ref: TableName.SKU},
    rfid: {type: String, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},

}, {timestamps: true, versionKey: false});

const rfidModel = model<IRfid>(TableName.RFID, rfidSchema);

export default rfidModel