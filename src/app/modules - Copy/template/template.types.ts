import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface ITemplate extends Document{
    _id: string;
    title: string
    slug: string
    subject: string
    body: string
    params: string
    type: number  //1=email,2=sms
    isActive: boolean
    isDeleted: boolean
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}