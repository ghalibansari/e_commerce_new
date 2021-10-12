import {Document} from "mongoose";
import { IUser } from "../user/user.types";
import { ISku } from "../sku/sku.types";

export interface ITransaction extends Document {
    _id: string;
    skuIds: ISku['_id'][];
    newIav: number;
    transactionType: string;
    transactionId: string;
    status: string;
    rapaportDate: Date;
    isActive: boolean;
    isDeleted: boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}