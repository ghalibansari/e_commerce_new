import { Model, Optional } from "sequelize";

interface IBUser {
    user_id: string
    first_name: string
    last_name: string
    mobile: number
    email: string
    password: string
    created_by: IBUser['user_id']
    updated_by: IBUser['user_id']
    deleted_by?: IBUser['user_id'] | null
}

interface IUser extends Optional<IBUser, 'user_id'> { }

interface IMUser extends Model<IBUser, IUser>, IBUser {
    deleted_by: IBUser['user_id'] | null
    created_on: Date;
    updated_on: Date;
    deleted_on: Date | null
}

export type { IUser, IMUser }