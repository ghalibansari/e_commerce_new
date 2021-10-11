import {Document} from "mongoose";
import {IUser} from "../user/user.types"
import {IAlertMaster} from "../alert-master/alert-master.types"
import { ICompany } from "../company/company.types";
import { ISku } from "../sku/sku.types";

export interface IAlert extends Document {
    _id: string;
    userId: IUser['_id'];
    skuId: ISku['_id'];
    companyId: ICompany['_id'];
    alertId: IAlertMaster['_id'];
    status: alertStatusEnum;
    readStatus: readStatusEnum;
    message: string;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}

export enum alertStatusEnum {
    IN = 'IN',
    OUT = 'OUT',
    SOLD = 'SOLD',
    MISSING = 'MISSING',
    CONSIGNMENT = 'CONSIGNMENT',
    DIAMOND_MATCH_REGISTRATION = 'DIAMOND MATCH REGISTRATION',
    DIAMOND_MATCH_NOT_PERFORMED = 'DIAMOND MATCH NOT PERFORMED'
}

export enum readStatusEnum {
    VIEWED = 'VIEWED',
    NOTVIEWED = 'NOTVIEWED'
}


export interface IAlertNested extends Document {
    _id: string;
    userId: IUser;
    skuId: ISku;
    companyId: ICompany;
    alertId: IAlertMaster;
    status: string;
    readStatus: string;
    message: string;
    createdBy: IUser;
    updatedBy: IUser;
    createdAt: Date;
    updatedAt: Date;
}