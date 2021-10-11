import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface IFingerPrint extends Document {
    index: number;
    data: string
}