import { Document } from "mongoose";
import { IUser } from "../user/user.types";
import { ICompany } from "../company/company.types";

export interface ISummaryReport extends Document {
    _id: string;
    to: string;
    cc: string[];
    bcc: string[];
    companyId: ICompany['_id'];
    isEnabled: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;
}