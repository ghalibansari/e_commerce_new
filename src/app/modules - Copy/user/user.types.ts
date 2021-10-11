import {Document, ObjectId} from "mongoose";
import {IAddress} from "../address/address.types";
import {IRole} from "../role/role.types";
import {ICompany} from "../company/company.types";
import {IFingerPrint} from "../fingerPrint/fingerPrint.types";

export interface IUser extends Document {
    _id: string;    //Todo convert all _id string types to ObjectId types...
    firstName: string;
    lastName: string;
    email: string;
    altEmail: string;
    password: string;
    addressId: IAddress['_id'];
    salt: string;
    interNationalCode: string;
    phone: string;
    roleId: IRole['_id'];
    badgeId: string;
    companyId: ICompany['_id'];
    fingerPrint: IFingerPrint[];
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    verificationMethod: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserNested extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    altEmail: string;
    password: string;
    addressId: IAddress;
    salt: string;
    phone: string;
    roleId: IRole;
    companyId: ICompany;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser;
    updatedBy: IUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAggregateIndexBR{
    data: any[];
    page: {
        hasNextPage: boolean;
        totalCount: number;
        currentPage: number;
        filterCount: number;
        totalPage: number;
    }
}

export enum userverificationMethodEnum {
    EMAIL = 'Email',
    MOBILE = 'mobile',
}