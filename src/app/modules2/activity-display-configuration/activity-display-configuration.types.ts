import {Document} from "mongoose";
import {IRole} from "../role/role.types";
import {ICompany} from "../company/company.types";
import {IUser} from "../user/user.types";
import {enumAlignment} from "../display-configuration/diaplay-configuration.types";

export interface IActivityDisplayConfigurationTypes extends Document {
    _id : string;
    companyId: ICompany['_id'] | ICompany;
    roleId: IRole['_id'] | IRole;
    userId: IUser['_id'] | IUser;
    value: string;
    sequence: number;
    preFix: string;
    postFix: string;
    alignment: enumAlignment;
    dbField: string;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: IUser['_id'] | IUser;
    updatedBy: IUser['_id'] | IUser;
    createdAt: Date;
    updatedAt: Date;
}
