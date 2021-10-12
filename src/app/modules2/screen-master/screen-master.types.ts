import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface IScreenMasterTypes extends Document {
    _id : string;
    screen: string;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'] | IUser;
    updatedBy: IUser['_id'] | IUser;
    createdAt: Date;
    updatedAt: Date;
}
