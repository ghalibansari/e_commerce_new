import {model, Schema} from "mongoose";
import { IEvent } from "./events.types";
import { required } from "joi";

const {Types: {ObjectId, String, Boolean}} = Schema

export const eventsSchema: Schema<IEvent> = new Schema({   
        EventType : {type:String,enum:["IN","OUT","INVENTORY"],required:true},
        stones : [String],
},{ _id : false})

