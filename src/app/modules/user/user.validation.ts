import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IUser, UserGenderEnum } from "./user.types";


export abstract class UserValidation extends BaseValidation {
    static readonly addUser = Joi.object<IUser>({
        first_name: Joi.string().min(3).max(100).required(),
        last_name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        gender: Joi.string().required().valid(...Object.values(UserGenderEnum)),
        mobile: Joi.number().required(),
        password: Joi.string().min(8).max(100).required()
    });

    static readonly addUserBulk = Joi.array().items(this.addUser)

    static readonly editUser = Joi.object<IUser>({
        first_name: Joi.string().min(3).max(100),
        last_name: Joi.string().min(3).max(100),
        gender: Joi.string().required().valid(...Object.values(UserGenderEnum)),
        email: Joi.string().email(),
        mobile: Joi.number(),
        password: Joi.string().min(8).max(100)
    });

    static readonly editProfile = Joi.object<IUser>({
        first_name: Joi.string().min(3).max(100),
        last_name: Joi.string().min(3).max(100),
        gender: Joi.string().required().valid(...Object.values(UserGenderEnum)),
        mobile: Joi.number()
    });
};