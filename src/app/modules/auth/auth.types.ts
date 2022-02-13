import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IUser } from "../user/user.types";

export enum authActionEnum {
    login = 'login',
    logout = 'logout',
    forgot_pass = 'forgot_pass',
    reset_pass = "reset_password",
    change_pass = 'change_pass',
    register = "register",
};
interface IBAuth extends IBCommon {
    auth_id: string;
    user_id: IUser["user_id"];
    action: authActionEnum
    ip: String;
    token?: String;
};

interface IAuth extends Optional<IBAuth, 'auth_id'> { };

interface IMAuth extends Model<IBAuth, IAuth>, IBAuth, IMCommon { }

export { IAuth, IMAuth };

