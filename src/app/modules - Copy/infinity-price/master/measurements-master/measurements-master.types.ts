import {Document} from "mongoose";
import { IUser } from "../../../user/user.types";

export interface IMeasurementsMaster extends Document {
    _id: string;
    length: number;
    bredth: number;
    width: number;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}