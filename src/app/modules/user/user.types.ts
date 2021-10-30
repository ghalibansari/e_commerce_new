import { Model, Optional } from "sequelize";

export enum UserGenderEnum {
    m = 'male',
    f = 'female',
    o = 'others'
}

interface IBUser {
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
    delete_reason?: string
    created_by: IBUser['user_id']
    updated_by: IBUser['user_id']
    deleted_by?: IBUser['user_id']
}

interface IUser extends Optional<IBUser, 'user_id'> { }

interface IMUser extends Model<IBUser, IUser>, IBUser {
    created_on: Date;
    updated_on: Date;
    deleted_on: Date | null
}

export type { IUser, IMUser }