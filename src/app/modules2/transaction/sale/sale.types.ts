import {Document} from "mongoose";
import {ISku} from "../../sku/sku.types";
import {IUser} from "../../user/user.types";


export interface ITransactionSale extends Document {
    _id: string;
    skuIds: ISku['_id'][];
    transactionId: string;
    isActive: boolean;
    isDeleted: boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}