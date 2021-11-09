import Joi, { required } from "joi";
import { BaseValidation } from "../BaseValidation";
import { IOrderAddress } from "./order-address.types";

export abstract class OrderAddressValidation extends BaseValidation {
    static readonly addOrderAddress = Joi.object<IOrderAddress>({
        address_1: Joi.string().required(),
        address_2: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pin_code: Joi.string().required(),

        });

    static readonly addOrderAddressBulk = Joi.array().items(this.addOrderAddress)

    static readonly editOrderAddress = Joi.object<IOrderAddress>({
        address_1: Joi.string(),
        address_2: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        pin_code: Joi.string(),
    });
};