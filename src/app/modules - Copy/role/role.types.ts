import {Document} from "mongoose";
import {IUser} from "../user/user.types";
import {ICompanyType} from "../company-type/company-type.types";

export interface IRole extends Document {
    _id: string;
    code: number;
    shortDescription: string;
    longDescription: string;
    companyTypeId: ICompanyType['_id'];
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}