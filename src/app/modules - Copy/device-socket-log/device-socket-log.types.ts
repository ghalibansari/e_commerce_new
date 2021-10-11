import {Document} from "mongoose";
import {IUser} from "../user/user.types";
import { IDevice } from "../device/device.types";

export interface IDeviceSocketLog extends Document {
    _id: string;
    deviceId: IDevice['_id']
    eventName: string;
    eventBody: string;
    createdBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}