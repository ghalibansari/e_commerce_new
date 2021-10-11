import {Document} from "mongoose";
import { IUser } from "../../../user/user.types";

export interface IClarityMaster extends Document {
    _id: string;
    clarity: string;
    // code: number;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}