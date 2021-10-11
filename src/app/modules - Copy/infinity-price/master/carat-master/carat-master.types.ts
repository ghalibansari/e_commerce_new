import { IUser } from "../../../user/user.types";
import {Document, ObjectId} from "mongoose";

export interface ICaratMaster extends Document {
    _id: ObjectId;
    fromCarat: number;
    toCarat: number;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}