import {IUser} from "../user/user.types";

export interface IAuth {
    "_id": IUser['_id'];
    "email": IUser['email']
    "iat": String;
    "exp": String;
}