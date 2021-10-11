import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface IAclModule extends Document {
    _id: string;
    moduleName: string;
    moduleUrl:string;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}