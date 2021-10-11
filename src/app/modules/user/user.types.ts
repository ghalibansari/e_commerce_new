import { Model, Optional } from "sequelize";

 interface IUser {
    user_id: string
    first_name: string
    last_name: string
    mobile: number
    email: string
    password: string
}

interface IUserCreateAttribute extends Optional<IUser, 'user_id'> {}

interface UserInstance extends Model<IUser, IUserCreateAttribute>, IUser {
    created_by: IUser['user_id']
    created_on: Date;
    updated_by: IUser['user_id']
    updated_on: Date;
    deleted_by: IUser['user_id']
    deleted_on: Date | null
}

export type { IUser, UserInstance }