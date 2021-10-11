import {Document, ObjectId} from "mongoose";
import {IUser} from "../user/user.types";
import { ISku } from "../sku/sku.types";

export interface IIav extends Document {    //Todo convert all _id string type to proper ObjectId type...
    _id: ObjectId;
    // _id: string;
    iav: number;
    drv: number;
    pwv: number;
    skuId: ISku['_id'];
    isActive:boolean;
    isDeleted:boolean;
    status: iavStatusEnum;
    effectiveDate: Date | null
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

export enum iavStatusEnum {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}