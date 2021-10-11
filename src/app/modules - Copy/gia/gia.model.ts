import {Document, model, Schema} from "mongoose";
import {IGia} from "./gia.types";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


//user schema.
const giaSchema: Schema = new Schema<Document<IGia>>({
    reportNumber: {type: Number, required: true, unique: true},
    // details: {type: String, required: true},
    details: {type: Object, required: true},
    // url: {type: String, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
}, {timestamps: true, versionKey: false});

const giaModel = model<IGia>(TableName.GIA, giaSchema);

export default giaModel