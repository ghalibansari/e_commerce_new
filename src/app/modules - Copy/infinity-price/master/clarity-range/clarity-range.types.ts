import {Document, ObjectId} from "mongoose";
import { IUser } from "../../../user/user.types";

export interface IClarityRange extends Document {
    _id: ObjectId;
    fromClarity: string;
    toClarity: string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}