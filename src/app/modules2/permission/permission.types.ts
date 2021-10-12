import {Document} from "mongoose";
import {IUser} from "../user/user.types";
import {ICompany} from "../company/company.types";
import {IRole} from "../role/role.types";
import {enumAlignment} from "../display-configuration/diaplay-configuration.types";


export interface IPermission extends Document {
    companyId: ICompany['_id']
    userId: IUser['_id']
    roleId : IRole['_id']
    permission: {screen: string; access: IAccess[] }[]
    createdBy: IUser["_id"]
    updatedBy: IUser["_id"]
    createdAt:Date;
    updatedAt:Date;
}

export enum IAccess {
    View = 'View',
    Add = 'Add',
    Edit = 'Edit',
    Delete = 'Delete',
    Status="Status",
    DiamondMatch="DiamondMatch",
    LightLed="Light Led",
    AddToCollateral="Add To Collateral",
    RemoveFromCollateral="Remove From Collateral",
    UpdateStatus="Update Status",
    TransistRequest="Transist Request",
    Edit4c="Edit4c",
    OpenBusiness="Open Business",
    CloseBusiness="Close Business",
    ExcelExport="Excel Export"
}

// export type IPermissionDefaultValues = {permission: {screen: string, access: IAccess[]}[]}
export type IPermissionDefaultValues = {
    roleId: string;
    permission: {
        screen: string,
        access: {key: IAccess, value: boolean}[]
    }[]
}