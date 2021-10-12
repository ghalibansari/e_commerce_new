import {IUser} from "../user/user.types";
import {Document, ObjectId} from "mongoose";
import {ISku} from "../sku/sku.types";

export interface ISkuInfinityPrice extends Document {
    _id: ObjectId;  //Todo convert all _id string types to ObjectId types...
    skuId: ISku['_id'];
    price: number;
    totalPrice: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}