import {IWeightRange} from "../../model/InfinityPriceCriteria";
import {IUser} from "../user/user.types";
import {Document} from "mongoose";
import { ICompany } from "../company/company.types";
import { ISku } from "../sku/sku.types";

export interface IClientPrice extends Document{
    _id: string;
    companyId: ICompany['_id'];
    skuId: ISku['_id'];
    shape:string;
    clarity:string;
    color:string;
    weight: number;
    price:number;
    pwvImport: number;
    effectiveDate:Date;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}