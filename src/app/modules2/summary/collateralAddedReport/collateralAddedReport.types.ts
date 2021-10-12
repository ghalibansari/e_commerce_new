import { ICompany } from "../../company/company.types";
import {Document} from "mongoose";

export interface ICollateralAddedReport extends Document {
    action: string;
    company: string;
    companyId: ICompany['_id']
    date: Date
    ref: string;
    reportLab: string;
    reportNumber: string;
    shape: string;
    colorCategory: string;
    colorSubCategory:string;
    caratWeight: number;
    gradingColor:string;
    gradingShape:string;
    clarity: string;
    cut: string;
    vc: number;
    drv: number;
    iav: number;
    pwv: number;
    lastDiamondMatch: Date;
    isActive: boolean
    isDeleted: boolean
    createdAt:Date;
}


