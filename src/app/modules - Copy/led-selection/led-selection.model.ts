import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import { ILedSelection } from "./ledSelection.types";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const ledSelectionSchema: Schema<ILedSelection> = new Schema({
    skuIds: [{type: ObjectId, ref: TableName.SKU , required: true}],
    tagCount: {type: Number, required: true},
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    lifeTime: {type: Date, default: null},
    comments: {type: String, default: ''},
    isActive: {type: Boolean, default:1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const ledSelectionModel = model<ILedSelection>(TableName.LED_SELECTION, ledSelectionSchema );

export default ledSelectionModel;