import {Document} from "mongoose";
import { ICompany } from "../../company/company.types";

export interface ICollateralUnAccountedReport extends Document {
    status: string;
    date: Date;
    company: string;
    companyId: ICompany['_id'];
    ref: string;
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
    vc: number;
    drv: number;
    pwv: number;
    iav: number;
    lastDiamondMatch: Date;
    isActive: boolean
    isDeleted: boolean
    createdAt:Date;

}
