import { Model, Optional } from "sequelize/types";
import { IBCommon, IMCommon } from "../baseTypes";
import { IMUser, IUser } from "../user/user.types";
// import { DataTypes } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid';

export enum authActionEnum {
    login = 'login',
    logout = 'logout',
    forgot_pass = 'forgot_pass',
    change_pass = 'change_pass',
    register = "register"
}
interface IBAuth extends IBCommon {
    auth_id: string;
    user_id: string;
    action: authActionEnum
    ip: String;
    token?: String;
}

interface IAuth extends Optional<IBAuth, 'auth_id'> {
}


interface IMAuth extends Model<IBAuth, IAuth>, IBAuth, IMCommon {}

export { IAuth, IMAuth }