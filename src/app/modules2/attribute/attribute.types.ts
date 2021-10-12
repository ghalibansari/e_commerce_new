import {Document} from "mongoose";

export interface IAttribute extends Document {
    _id: string;
    key: string,
    value: string,
}