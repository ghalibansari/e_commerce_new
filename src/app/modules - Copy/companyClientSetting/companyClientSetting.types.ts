import {Document, Schema} from "mongoose";
import {ICompany} from "../company/company.types";
import {IUser} from "../user/user.types";
import {ObjectId} from "mongoose";
import {TPercentage} from "../../interfaces/ETC";


export interface ICompanyClientSetting extends Document {
    _id: ObjectId;
    diamondMatchRegistration: boolean;
    companyId: ICompany['_id'];
    isOpenBusiness: ICompanyClientSettingIsOpenBusiness
    ltv: TPercentage;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}

export enum ICompanyClientSettingIsOpenBusiness {
    NO = 'NO',
    DAILY = 'DAILY',
    MULTI = 'MULTI',
}

export interface IDiamondMachSettingNested extends Document {
    _id: string;
    diamondMatchRegistration: boolean;
    companyId: ICompany;
    isOpenBusiness: ICompanyClientSettingIsOpenBusiness
    ltv: TPercentage;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser;
    updatedBy: IUser;
    createdAt: Date;
    updatedAt: Date;
}