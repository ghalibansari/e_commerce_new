import {IUser} from "../user/user.types";
import {Document, ObjectId} from "mongoose";
import {ICompany} from "../company/company.types";
import {TPercentage} from "../../interfaces/ETC";

export interface ILoan extends Document{
    _id: ObjectId;  //Todo convert all _id string types to ObjectId types...
    companyId: ICompany['_id'];
    amount: number;
    infinityCollateral: number;
    clientCollateral: number;
    collateralShortfall: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

export interface ILoanNested extends Document{
    _id: ObjectId;  //Todo convert all _id string types to ObjectId types...
    companyId: ICompany;
    amount: number;
    infinityCollateral: number;
    clientCollateral: number;
    collateralShortfall: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy:IUser;
    updatedBy:IUser;
    createdAt:Date;
    updatedAt:Date;
}

export interface ILoanGroupByCompanyId{
    _id: ObjectId,
    loanAmount: number,
    companyName: String,
    ltv: TPercentage,
    stones: number,
    infinityCollateralValue: number,
    borrowingBase: number,
    collateralShortfall: number
}