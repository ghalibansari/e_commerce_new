import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IUserAddress } from "./user-address.type";

export abstract class UserAddressValidation extends BaseValidation {
    static readonly addUserAddress = Joi.object<IUserAddress>({
        address_id: Joi.string().required(),
        user_id: Joi.string().required(),
        is_default: Joi.boolean().required(),
        address_1: Joi.string().required(),
        address_2: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pin_code: Joi.string().required(),

    });

    static readonly addUserAddressBulk = Joi.array().items(this.addUserAddress)

    static readonly editUserAddress = Joi.object<IUserAddress>({
        address_id: Joi.string(),
        user_id: Joi.string(),
        is_default: Joi.boolean(),
        address_1: Joi.string(),
        address_2: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        pin_code: Joi.string(),
    });

    static readonly updateUserAddress = Joi.object<IUserAddress>({
        address_id: Joi.string(),
        user_id: Joi.string(),
        is_default: Joi.boolean(),
        address_1: Joi.string(),
        address_2: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        pin_code: Joi.string(),
    });
};