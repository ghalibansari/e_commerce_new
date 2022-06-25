import Joi from "joi";
import { BaseValidation, idValidate } from "../BaseValidation";
import { ICoupon } from "../coupon/coupon.type";
import { IOrderHistory } from "./order-history.type";

export abstract class OrderValidation extends BaseValidation {
    static readonly placeOrder = Joi.object<{address_id: string, coupon_code: string}>({
        address_id: Joi.string().required().custom(idValidate),
        coupon_code: Joi.string()
    });

    static readonly addOrderBulk = Joi.array().items(this.placeOrder)

    static readonly editOrder = Joi.object<IOrderHistory>({
        order_id: Joi.string()
    });

    static readonly checkout = Joi.object({
        coupon_code: Joi.string(),
        address_id: Joi.string().custom(idValidate),
    });
};