import { Document } from "mongoose";
import { IUser } from "../user/user.types";
import { ICompany } from "../company/company.types";
import { IDevice } from "../device/device.types"
export interface IDeviceCommand extends Document {
    _id: string;
    command: string;
    companyId: ICompany['_id'];
    deviceId: IDevice['_id']
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}