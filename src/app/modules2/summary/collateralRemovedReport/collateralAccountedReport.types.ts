import {Document} from "mongoose";
import { ICompany } from "../../company/company.types";

export interface ICollateralRemovedReport extends Document {
    company: string
    companyId: ICompany['_id']
    date: Date;
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
