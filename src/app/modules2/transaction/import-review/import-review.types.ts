import {Document} from "mongoose";
import {ISku} from "../../sku/sku.types";
import {IUser} from "../../user/user.types";


export interface ITransactionImportReview extends Document {
    _id: string;
    skuId: ISku['_id'];
    transactionId: string;
    status: string;
    approvedBy: IUser['_id'];
    isActive: boolean;
    isDeleted: boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}