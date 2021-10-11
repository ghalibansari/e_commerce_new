import {Document, ObjectId} from "mongoose";
import {IUser} from "../user/user.types";
import {IInfinityPriceMaster} from "../infinity-price/master/infinity-price-master/infinity-price-master.types";
import {skuColorTypeEnum} from "../sku/sku.types";

export interface IInfinityPriceNew extends Document {
    _id: ObjectId;
    infinityPriceMasterId: IInfinityPriceMaster['_id'];
    price:number;
    effectiveDate:Date;
    stoneType: skuColorTypeEnum;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

export type IExport = {price: number, stoneType: string, color: string, clarity: string, fromCarat: number, toCarat: number}