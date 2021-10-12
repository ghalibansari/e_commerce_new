import {Document} from "mongoose";
import { ICompany } from "../company/company.types";
import { IRfid } from "../rfid/rfid.types";
import { ISku } from "../sku/sku.types";
import {IUser} from "../user/user.types";


export interface ILedSelection extends Document{
    _id: string;
    skuIds: ISku['_id'];
    tagCount: number;
    companyId: ICompany['_id'];
    comments: string;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    lifeTime: Date;
    createdAt:Date;
    updatedAt:Date;
}