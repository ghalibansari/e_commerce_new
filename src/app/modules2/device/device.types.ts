import {Document} from "mongoose";
import {IUser} from "../user/user.types";
import { ICompany } from "../company/company.types";
import { IDeviceType } from "../device-type/device-type.types";

export interface IDevice extends Document {
    _id: string;
    name: string;
    companyId: ICompany['_id'];
    serialNumber: string;
    token: string;
    description: string;
    userIds: IUser['_id'][]
    deviceTypeId: IDeviceType['_id'];
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}