import { Model, Optional } from "sequelize/types";
import { IMUser, IUser } from "../user/user.types";
// import { DataTypes } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid';

interface IBAuth {
    auth_id: string;
    user_id: string;
    action: authActionEnum
    ip: String;
    token: String;
    created_by: IUser['user_id']
    updated_by: IUser['user_id']
    deleted_by?: IUser['user_id'] | null
}

interface IAuth extends Optional<IBAuth, 'auth_id'> {
}

enum authActionEnum {
    login = 'login',
    logout = 'logout',
    forgot_pass = 'forgot_pass',
    // frontend = 'frontend'
}
interface IMAuth extends Model<IBAuth, IAuth>, IBAuth {
    deleted_by: IMUser['user_id'] | null
    created_on: Date;
    updated_on: Date;
    deleted_on: Date | null
}

export { IAuth, IBAuth, IMAuth, authActionEnum }