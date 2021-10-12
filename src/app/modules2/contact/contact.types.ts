import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface IContact extends Document {
    _id: string;
    countryCode: string;
    number:string
    name:string;
    email:string;
    jobDescription:string;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}