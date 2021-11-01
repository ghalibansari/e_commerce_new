import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

export enum UserGenderEnum {
    m = 'male',
    f = 'female',
    o = 'others'
}


interface IBUser extends IBCommon {
    user_id: string
    first_name: string
    last_name: string
    mobile: string
    email: string
    gender: UserGenderEnum
    password: string
    is_active?: boolean
    email_verified_at?: Date
    remember_token?: string
}

interface IUser extends Optional<IBUser, 'user_id'> { }

interface IMUser extends Model<IBUser, IUser>, IBUser, IMCommon { }

export { IUser, IMUser };
