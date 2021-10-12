import {Document} from "mongoose";
import {IAclUrl} from "../acl-url/acl-url.types";
import {IUser} from "../user/user.types";

export interface IAclRoleUrl extends Document {
    _id: string;
    roleId: string;
    urlId:IAclUrl["_id"];
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}