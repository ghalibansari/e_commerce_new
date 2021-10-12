import {Document} from "mongoose";
import {IUser} from "../user/user.types"
// import {IAlertMaster} from "../alert-master/alert-master.types"
// import { ICompany } from "../company/company.types";

export interface IVerification extends Document {
    _id: string
    userId: IUser['_id']
    otp: string
    messageId: string
    type: string
    operation: string
    module:string
    data:string
    isVerified: boolean
    ip: string
    isActive:boolean
    isDeleted:boolean
    createdAt:Date;
    updatedAt:Date;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
}