import {Document} from "mongoose";
import { IUser } from "../user/user.types";

export interface ILabMaster extends Document {
    _id: string;
    labType: string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}