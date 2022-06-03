import Joi, { required } from "joi";
import { BaseValidation } from "../BaseValidation";
import { IOrderAddress } from "./order-address.types";

export abstract class OrderAddressValidation extends BaseValidation {
    static readonly addOrderAddress = Joi.object<IOrderAddress>({
        address_1: Joi.string().required(),
        address_2: Joi.string().required(),
        city_id: Joi.string().required(),
        state_id: Joi.string().required(),
        pincode_id: Joi.string().required()

        });

    static readonly addOrderAddressBulk = Joi.array().items(this.addOrderAddress)

    static readonly editOrderAddress = Joi.object<IOrderAddress>({
        address_1: Joi.string(),
        address_2: Joi.string(),
        city_id: Joi.string(),
        state_id: Joi.string(),
        pincode_id: Joi.string(),
    });
};