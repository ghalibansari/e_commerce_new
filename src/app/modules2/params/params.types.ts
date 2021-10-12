import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface IParams extends Document {
    _id: string;
    premiumCycle: number;
    premiumPercent:string
    regularCycle: number;
    randomPercent:string;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}