import {Document, ObjectId} from "mongoose";
import { IUser } from "../../../user/user.types";

export interface IColorRange extends Document {
    _id: ObjectId;
    fromColor: number;
    toColor: number;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}