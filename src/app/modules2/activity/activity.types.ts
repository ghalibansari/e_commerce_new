import {Document} from "mongoose";
import { IRapPrice } from "../rap-price/rap-price.types";
import { IUser } from "../user/user.types";
import { ISku } from "../sku/sku.types";
import { ILab } from "../lab/lab.types";
import { ICompany } from "../company/company.types";
import { IIav } from "../iav/iav.types";

export interface IActivity extends Document {
    userId: IUser['_id']
    companyId: ICompany['_id']
    skuId : ISku['_id']
    labsId : ILab['_id'][]
    iavId: IIav['_id']
    // iav: string
    // drv: string
    // pwv: string
    // VC:number
    dmId: string
    status: string,
    comments:string,
    createdBy: IUser["_id"]
    updatedBy: IUser["_id"]
    createdAt:Date;
    updatedAt:Date;
}