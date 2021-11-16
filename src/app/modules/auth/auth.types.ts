import { Model, Optional } from "sequelize/types";
import { IBCommon, IMCommon } from "../baseTypes";

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
    user_id: string;
    action: authActionEnum
    ip: String;
    token?: String;
};

interface IAuth extends Optional<IBAuth, 'auth_id'> {
};


interface IMAuth extends Model<IBAuth, IAuth>, IBAuth, IMCommon { }

export { IAuth, IMAuth };

