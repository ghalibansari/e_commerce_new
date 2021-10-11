import {Document} from "mongoose"
import {IUser} from "../user/user.types";
import {IAclUrl} from "../acl-url/acl-url.types";

export interface IAclUserUrl extends Document {
    _id: string;
    userId: IUser['_id'];
    urlId:IAclUrl['_id'];
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}