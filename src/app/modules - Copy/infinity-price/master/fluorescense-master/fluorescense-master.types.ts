import {Document, ObjectId} from "mongoose";
import { IUser } from "../../../user/user.types";

export interface IFluorescenseMaster extends Document {
    _id: ObjectId;
    fluorescense: string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}
