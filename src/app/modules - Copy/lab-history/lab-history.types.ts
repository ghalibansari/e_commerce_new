import {Document} from "mongoose";
import {IUser} from "../user/user.types";


export interface ILabHistory extends Document{
    _id: string;
    lab: string;
    labReportId: string;
    labReportPath: string;
    labReportDate: Date;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

