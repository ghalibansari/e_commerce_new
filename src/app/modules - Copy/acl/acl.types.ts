import {Document} from "mongoose";
import {IUser} from "../user/user.types";
import {ICompany} from "../company/company.types";

//@ts-expect-error
export interface IAcl extends Document {
    _id: string;
    companyId:ICompany['_id'];
    userId:IUser['_id'];
    module: string;
    url:string;
    isDelete:boolean;
    viewAll:boolean;
    viewOne:boolean;
    add:boolean;
    edit:boolean;
    delete:boolean;
    faker:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}