import {ClientSession} from "mongoose";
// import { IRole } from "./role/role.types";
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


//@ts-expect-error
export interface ILoggedInUser extends Required<Pick<IUser, '_id'|'email'|'companyId'|'firstName'|'lastName'|'roleId'>> {
    //@ts-expect-error
    roleName: Pick<IRole, 'shortDescription'>;//IRole['shortDescription']
    iat: number;
    exp: number;
}

// export type IFindBR{}
