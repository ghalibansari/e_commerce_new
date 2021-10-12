import {Document, ObjectId} from "mongoose";
import { IUser } from "../user/user.types";

export interface IUserAlerts extends Document {
    _id: ObjectId;
    userIds: IUser['_id'][];
    message: string;
    level: string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}