import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface ICompanyType extends Document {
    _id: string;
    code: string;
    shortDescription: string;
    longDescription: string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}