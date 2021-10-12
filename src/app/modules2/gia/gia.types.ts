import {Document} from "mongoose";
import {IAddress} from "../address/address.types";
import {IRole} from "../role/role.types";
import {ICompany} from "../company/company.types";
import {IUser} from "../user/user.types";

export interface IGia extends Document {
    _id : string;
    reportNumber : Number;
    details : string;
    // url : string;
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

