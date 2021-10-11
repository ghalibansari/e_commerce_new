import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface IStatus extends Document {
    _id: string;
    code: string;
    description: string;
    type: string;
    isActive: boolean
    isDeleted: boolean
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}