import {Document} from "mongoose";

export interface IEvent extends Document {
    EventType: string;
    stones: string[];
}