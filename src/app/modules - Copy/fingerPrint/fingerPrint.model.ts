import {model, Schema} from "mongoose";

import { number, required } from "joi";
import { IFingerPrint } from "./fingerPrint.types";

const {Types: {ObjectId, String, Boolean}} = Schema

export const fingerPrintSchema: Schema<IFingerPrint> = new Schema({   
       index: {type: Number, required: true},
       data: {type: String, required: true}
},{ _id : false})

