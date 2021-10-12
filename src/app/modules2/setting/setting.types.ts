import {Document} from "mongoose";
import {IUser} from "../user/user.types";

export interface ISetting extends Document {
    _id: string;
    giaProductionKey: string;
    giaSandBoxKey: string;
    EmailId: string;
    EmailPassword: string;
    EmailHost: string;
    EmailPort: number;
    EmailSecure: boolean;
    EmailFrom: string
    EmailTo: string
    MailSender: string;
    cdnUrl: string;
    giaKey: giaKeyEnum;
    masterPassword: string;
    defaultPageSize: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}

export enum giaKeyEnum{
    PRODUCTION = 'PRODUCTION',
    SANDBOX = 'SANDBOX'
}