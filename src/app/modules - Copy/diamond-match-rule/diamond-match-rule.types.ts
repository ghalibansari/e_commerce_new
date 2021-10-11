import {Document} from "mongoose";
import {IParams} from "../params/params.types"
import {ICompany} from "../company/company.types";
import {IUser} from "../user/user.types";

export interface IDiamondMatchRule extends Document {
    _id: string;
    param: IParams;
    companyId: ICompany['_id'];
    effectiveDate: Date;
    endDate: Date;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}