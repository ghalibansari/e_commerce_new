import { Document } from "mongoose";
import { IUser } from "../user/user.types";
import { ICompany } from "../company/company.types";
import { IDevice } from "../device/device.types"
export interface IDeviceLog extends Document {
    _id: string;
    deviceLog: Object;
    companyId: ICompany['_id'];
    deviceId: IDevice['_id']
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}