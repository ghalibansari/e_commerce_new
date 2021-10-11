import {Document, ObjectId} from "mongoose";
import { IUser } from "../user/user.types";
import {skuColorTypeEnum} from "../sku/sku.types";

export interface IStoneTypeMaster extends Document {
    _id: ObjectId;
    type: skuColorTypeEnum;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}