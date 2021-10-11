import {Document} from "mongoose";
import { ICompany } from "../../company/company.types";

export interface IDialyMatchReport extends Document {
    ref: string;
    company: string;
    companyId: ICompany['_id'];
    action: string;
    actionDate: Date;
    success: string;
    assetType: string;
    groupDate: Date;
    reportLab: string;
    reportNumber: string
    caratWeight: number
    shape: string;
    colorCategory: string;
    colorSubCategory:string;
    gradingColor:string;
    gradingShape:string;
    clarity: string;
    cut: string;
    value: number;
    completion: string;
    isActive: boolean
    isDeleted: boolean
    createdAt:Date;

}