import {Document} from "mongoose";
import {IUser} from "../user/user.types";
import { ISku } from "../sku/sku.types";
import { ICompany } from "../company/company.types";

export interface IDiamondRegistration extends Document {
    _id: string;
    skuId: ISku['_id'];
    companyId: ICompany['_id'];
    dmGuid: string;
    action: string;
    status: string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}