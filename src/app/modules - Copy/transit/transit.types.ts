import {Document} from "mongoose";
import {IComment} from "../comment/comment.types";
import {IStatus} from "../status/status.types";
import {IAddress} from "../address/address.types";
import {ISku} from "../sku/sku.types";
import {IUser} from "../user/user.types";

export interface ITransit extends Document{
    _id: string;
    skuIds: ISku['_id'][];
    comments: IComment[];
    transitTime: Date;
    returnTime: Date;
    // time: Date;
    // from: IAddress['_id'];
    // to: IAddress['_id'];
    // statusId: IStatus['_id'];
    status: ITransitStatusEnum;
    isSchedule: boolean;
    schedule: {
        sendOn: string,
        returnHrs: string,
        returnType: string
    }
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}

export enum ITransitStatusEnum {
    INITIATED = 'INITIATED',
    INPROGRESS = 'INPROGRESS',
    DELIVERED = 'DELIVERED'
}
