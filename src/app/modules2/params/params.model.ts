import {model, Schema, Document} from "mongoose";
import {IParams} from "./params.types";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


const paramsSchema: Schema = new Schema<Document<IParams>>({
    premiumCycle: {type: Number, required: true},
    premiumPercent: {type: Number, required: true},
    regularCycle: {type: Number, required: true},
    randomPercent: {type: Number, required: true},
    threshold:{type:Number}
}, {timestamps: true, versionKey: false});

export {paramsSchema}