import {Document} from "mongoose";
import {IUser} from "../user/user.types"
import { IRole } from "../role/role.types";

export interface IAccess extends Document {
    _id: string
    roleId: IRole['_id'];
    userId: IUser[];
    modules: object[];
    isActive: boolean;
    isDeleted: boolean;
    createdAt:Date;
    updatedAt:Date;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
}