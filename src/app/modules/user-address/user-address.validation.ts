import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IUserAddress } from "./user-address.type";

export abstract class UserAddressValidation extends BaseValidation {
    static readonly addUserAddress = Joi.object<IUserAddress>({
        is_default: Joi.boolean(),
        address_1: Joi.string().required(),
        address_2: Joi.string(),
        city_id: Joi.string().required(),
        state_id: Joi.string().required(),
        pincode_id: Joi.string().required()
    });

    static readonly addUserAddressBulk = Joi.array().items(this.addUserAddress)

    static readonly editUserAddress = Joi.object<IUserAddress>({
        address_id: Joi.string(),
        user_id: Joi.string(),
        is_default: Joi.boolean(),
        address_1: Joi.string(),
        address_2: Joi.string(),
        city_id: Joi.string(),
        state_id: Joi.string(),
        pincode_id: Joi.string(),
    });

    static readonly updateUserAddress = Joi.object<IUserAddress>({
        is_default: Joi.boolean(),
        address_1: Joi.string(),
        address_2: Joi.string(),
        city_id: Joi.string(),
        state_id: Joi.string(),
        pincode_id: Joi.string(),
    });
};