import {Errors, Messages, Regex} from "../../constants";
import Joi from "joi";
import {NextFunction, Request, Response} from "express";
import {JsonResponse} from "../../helper";
import {IUser, UserGenderEnum} from "./user.types";
import { BaseValidation } from "../BaseValidation";


export abstract class UserValidation extends BaseValidation {
    static readonly addUser = Joi.object<IUser>({
        first_name: Joi.string().min(3).max(100).required(),
        last_name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        gender: Joi.string().required().valid(...Object.values(UserGenderEnum)),
        mobile: Joi.number().required(),
        password: Joi.string().min(8).max(100).required(),
        created_by: Joi.any(),
        updated_by: Joi.any()
    });

    static readonly addUserBulk = Joi.array().items(this.addUser)

    static readonly editUser = Joi.object<IUser>({
        first_name: Joi.string().min(3).max(100),
        last_name: Joi.string().min(3).max(100),
        email: Joi.string().email(),
        mobile: Joi.number(),
        password: Joi.string().min(8).max(100)
    });
};