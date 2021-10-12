import {Document, ObjectId} from "mongoose";
import { IUser } from "../user/user.types";

export interface IAlertConfiguration extends Document {
    _id: ObjectId;
    category: string;
    type: [string];
    level: string;
    reciever: IUser['_id'][];
    cc: IUser['_id'][];
    frequency: string;
    schedule: [string];
    scheduleTime: string;
    message: string
    isActive:boolean;
    isDeleted:boolean;
    runTime:Date;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}