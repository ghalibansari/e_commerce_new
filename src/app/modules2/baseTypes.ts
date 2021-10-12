import {ClientSession} from "mongoose";
import { IRole } from "./role/role.types";
import { IUser } from "./user/user.types";

export interface ICounter{
    key: string;
    value: string
}

export interface IAggregateIndexBR{
    aggregateCond: any[];
    sort: {};
    pagenumber: number; //Todo fix typo
    pagesize: number;
    mongoSession: ClientSession;
}

export interface ILoggedInUser extends Required<Pick<
    IUser, '_id'|'email'|'companyId'|'firstName'|'lastName'|'roleId'
>> {
    roleName: Pick<IRole, 'shortDescription'>;//IRole['shortDescription']
    iat: number;
    exp: number;
}
