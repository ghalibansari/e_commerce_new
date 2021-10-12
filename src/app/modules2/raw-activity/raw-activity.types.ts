import {Document} from "mongoose";
import { IUser } from "../user/user.types";
import { IDevice } from "../device/device.types";
import { IEvent } from "../events/events.types";

export interface IRawActivity extends Document {
    companyId: string;
    reader:{
        serial: string;
        drawer: number;
    }
    transactionId: string
    user: IUser["_id"];
    timestamp: Date;
    deviceId: IDevice['_id']
    isTagValidated: boolean;
    isCountChecked: boolean;
    events:IEvent[]
    isActive: boolean;
    isDeleted: boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}