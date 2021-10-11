import { ICompany } from "../../company/company.types";
import {Document} from "mongoose";

export interface IDiamondMatchSheetReport extends Document {
    companyId: ICompany['_id'];
    matchDate: Date;
    ref: string;
    reportLab: string;
    reportNumber: string
    caratWeight: number
    shape: string;
    colorCategory: string;
    colorSubCategory:string;
    gradeReportColor:string;
    clarity: string;
    cut: string;
    value: number;
    typeOfDiamondMatch: string;
    action: string;
    success: string;
    message: String;
    matchLocation: String;
    isActive: boolean
    isDeleted: boolean
    createdAt:Date;
    updatedAt:Date;

}