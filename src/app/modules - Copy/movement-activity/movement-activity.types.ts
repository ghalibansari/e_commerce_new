import {Document} from "mongoose";
import {ICompany} from "../company/company.types";
import {ISku} from "../sku/sku.types";
import {IUser} from "../user/user.types";
import { IDeviceType } from "../device-type/device-type.types";

export interface IMovementActivity extends Document {
    _id : string;
    skuId : ISku['_id'];
    companyId:ICompany['_id'];
    deviceTypeId:IDeviceType['_id'];
    actionType:ActionType;
    dmId:string;
    actionOpenIp:string;
    actionCloseIp:string;
    toDate:Date;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

export enum ActionType {
    INVENTORY = 'INVENTORY',
    ALERT = 'ALERT',
    IN = 'IN',
    OUT = 'OUT',
    APPROVED = 'APPROVED',
    FINGERPRINT = 'FINGERPRINT',
    ARRIVAL = 'ARRIVAL',
    OPENBIZ = 'OPENBIZ',
    CLOSEBIZ = 'CLOSEBIZ',
    SOLD = 'SOLD',
    VAULT = 'VAULT',
    MISSING = 'MISSING',
    RESTART = 'RESTART',
    RETURN = 'RETURN',
    PING = 'PING',
    OPERATIONAL = 'OPERATIONAL',
    STANDBY = 'STANDBY',
    TRANSIT = 'TRANSIT',
    COLLATERAL = 'COLLATERAL'
}

