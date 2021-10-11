import {Document} from "mongoose";
import {IAddress} from "../address/address.types";
import {IRole} from "../role/role.types";
import {ICompany} from "../company/company.types";
import {IUser} from "../user/user.types";

export interface IDisplayConfiguration extends Document {
    _id : string;
    companyId:string;
    roleId:string;
    userId:string;
    screen:string;
    config:Array<any>;
   /* dbField : string;
    display : string;
    alignment : enumAlignment;
    prefix : string;
    postfix : string;*/
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

export enum enumAlignment {
    center = 'center',
    right = 'right',
    left = 'left',
    null = 'null'
}

// export type IDefaultValues<K extends keyof T> = {valKey: T[K], text: string, align: enumAlignment, sequence: number, preFix: string, postFix: string}
export type IDefaultValues = {valKey: string, text: string, align: enumAlignment, sequence: number, preFix: string, postFix: string, isActive: boolean, isDeleted: boolean}