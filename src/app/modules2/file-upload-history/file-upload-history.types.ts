import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface IFileUploadHistory extends Document {
    _id: string;
    fileName: string;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}