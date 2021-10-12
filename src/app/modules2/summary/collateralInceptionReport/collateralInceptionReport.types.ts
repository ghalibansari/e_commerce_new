import {Document} from "mongoose";
import { ICompany } from "../../company/company.types";

export interface ICollateralInceptionReport extends Document {
    company: string;
    companyId: ICompany['_id']
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