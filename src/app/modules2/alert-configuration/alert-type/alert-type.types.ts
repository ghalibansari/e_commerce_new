import { IUser } from "../../user/user.types";
import {Document} from "mongoose";

export interface IAlertType extends Document {
    _id: string,
    type: string,
    isActive:boolean;
    isDeleted:boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;

}