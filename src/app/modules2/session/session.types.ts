import {Document, ObjectId} from "mongoose";
import {IAddress} from "../address/address.types";
import {IUser} from "../user/user.types";

export interface ISession extends Document {
    _id: ObjectId;
    userId: IUser['_id'];
    token: string;
    ip: string;
    loginType: sessionLoginTypeEnum;
    isLoggedIn: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export enum sessionLoginTypeEnum{
    email = 'email',
    sms = 'sms'
}

