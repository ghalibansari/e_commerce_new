import {Document} from "mongoose";
import {IUser} from "../user/user.types";
import { ICompany } from "../company/company.types";
import { IDeviceType } from "../device-type/device-type.types";
import { IDiamondMatchRule } from "../diamond-match-rule/diamond-match-rule.types";
import { ISku } from "../sku/sku.types";

export interface IDiamondMatch extends Document {
    _id: string;
    diamondMatchRuleId: IDiamondMatchRule['_id'];
    status: string;
    skuId: ISku['_id'];
    companyId: ICompany['_id'];
    performedBy: IUser['_id']
    dmType: string,
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}