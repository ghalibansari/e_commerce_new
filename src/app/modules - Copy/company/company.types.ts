import {Document, ObjectId} from "mongoose";
import {IContact} from "../contact/contact.types";
import {IAddress} from "../address/address.types";
import {ICompanyType} from "../company-type/company-type.types";
import {ICompanySubType} from "../company-sub-type/company-sub-type.types";
import {IUser} from "../user/user.types";

export interface ICompany extends Document {
    _id: string;
    name: string;
    addressId:IAddress['_id']
    contacts:IContact[];
    logoUrl:string;
    companyTypeId:ICompanyType['_id'];
    companySubTypeId:ICompanySubType['_id'];
    parentId:ICompany['_id'];
    createdBy?:IUser['_id'];
    updatedBy?:IUser['_id'];
    createdAt?:Date;
    updatedAt?:Date;
}

export interface ICompanyNested extends Document {
    _id: string;
    name: string;
    addressId:IAddress
    contacts:IContact[];
    logoUrl:string;
    companyTypeId:ICompanyType;
    companySubTypeId:ICompanySubType;
    parentId:ICompany;
    createdBy?:IUser;
    updatedBy?:IUser;
    createdAt?:Date;
    updatedAt?:Date;
}

export interface ICompanySave extends ICompany {
    address: IAddress;
}