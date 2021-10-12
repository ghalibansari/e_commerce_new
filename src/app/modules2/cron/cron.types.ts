import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface ICron extends Document {
    _id: string;
    name: cronName;
    time: string;
    days: string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    lastRunTime: Date;
    createdAt:Date;
    updatedAt:Date;
}

export enum cronName {
    FETCH_RAPPORT_PRICE = 'FETCH_RAPPORT_PRICE',
    ACTIVITY_HISTORY = 'ACTIVITY_HISTORY',
    DIAMOND_MATCH = 'DIAMOND_MATCH',
    UPDATE_SKU = "UPDATE_SKU",
    POWER_BI_REPORT = "POWER_BI_REPORT"
}