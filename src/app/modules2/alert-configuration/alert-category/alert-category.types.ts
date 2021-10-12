import { IUser } from "../../user/user.types";
import {Document, ObjectId} from "mongoose";

export interface IAlertCategory extends Document {
    _id: ObjectId,
    category: string,
    isActive:boolean;
    isDeleted:boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;

}