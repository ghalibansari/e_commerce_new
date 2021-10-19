import { IUser } from "../user/user.types";

interface IAuth {
    "_id": IUser['user_id'];
    "email": IUser['email']
    "iat": String;
    "exp": String;
}

interface ILogin {
    email: IUser['email']
    password: IUser['password'];
}

export { ILogin }