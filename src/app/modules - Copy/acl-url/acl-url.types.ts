import {Document} from "mongoose"
import {IUser} from "../user/user.types";
import {IAclModule} from "../acl-module/acl-module.types";

export interface IAclUrl extends Document {
    _id: string;
    moduleId: IAclModule['_id'];
    urlName:string;
    urlMethod:string;
    url:string;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}