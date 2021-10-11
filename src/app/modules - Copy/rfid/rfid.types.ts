import {Document, ObjectId} from "mongoose";
import {IUser} from "../user/user.types";
import {ISku} from "../sku/sku.types";

export interface IRfid extends Document {
    _id : ObjectId;
    skuId : ISku['_id'];
    rfid : string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

export interface IRfidNested extends Document {
    _id : ObjectId;
    skuId : ISku;
    rfid : string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser;
    updatedBy:IUser;
    createdAt:Date;
    updatedAt:Date;
}