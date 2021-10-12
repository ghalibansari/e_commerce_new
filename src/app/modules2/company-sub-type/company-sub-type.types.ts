import {Document} from "mongoose";
import { ObjectID } from "bson";
import {IUser} from "../user/user.types";
import {ICompanyType} from "../company-type/company-type.types";

export interface ICompanySubType extends Document {
    _id: string;
    code: string;
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