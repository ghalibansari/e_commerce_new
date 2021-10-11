import {model, Schema} from "mongoose";
import { IBusiness } from "./business.types";
import { eventsSchema } from "../events/events.model";
import { string, boolean } from "joi";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema

const BusinessSchema: Schema<IBusiness> = new Schema({
    companyId: { type: ObjectId, ref: TableName.COMPANY, required: true},
    action: [{type: String, enum: ['OPEN','CLOSE'], required: true}],
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    comments: {type: String, default: null},
    openSkuIds: [{type: ObjectId, ref: TableName.SKU}],
    openColleteralCount: {type: Number},
    openMissingCount: {type: Number},
	openSoldCount: {type: Number},
	closeColleteralCount: {type: Number},
	closeMissingCount: {type: Number},
	closeSoldCount: {type: Number},
    closeSkuIds: [{type: ObjectId, ref: TableName.SKU}],
    lastOpenedAt : {type: Date, default: null},
    lastClosedAt : {type: Date, default: null},
    lastOpenedBy: {type: ObjectId, ref: TableName.USER, default: null},
    lastClosedBy: {type: ObjectId, ref: TableName.USER, default: null},
}, {timestamps: true, versionKey: false});

const BusinessModel = model<IBusiness>(TableName.BUSINESS, BusinessSchema);

export default BusinessModel