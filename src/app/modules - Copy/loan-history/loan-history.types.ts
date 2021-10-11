import {IUser} from "../user/user.types";
import {Document, ObjectId} from "mongoose";
import {ICompany} from "../company/company.types";
import {TPercentage} from "../../interfaces/ETC";

export interface ILoanHistory extends Document{
    _id: ObjectId;  //Todo convert all _id string types to ObjectId types...
    companyId: ICompany['_id'];
    amount: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}