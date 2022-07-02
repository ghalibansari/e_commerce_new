import Joi from "joi";
import { BaseValidation, idValidate } from "../BaseValidation";
import { ICoupon } from "../coupon/coupon.type";
import { IOrder } from "./order.type";

export abstract class OrderValidation extends BaseValidation {
    static readonly placeOrder = Joi.object<{address_id: string, coupon_code: string}>({
        address_id: Joi.string().required().custom(idValidate),
        coupon_code: Joi.string()
    });

    static readonly addOrderBulk = Joi.array().items(this.placeOrder)

    static readonly editOrder = Joi.object<IOrder>({
        order_id: Joi.string(),
        user_id: Joi.string(),
        transaction_id: Joi.string(),
        grand_total: Joi.number(),
        shipping_charges: Joi.number(),
        type: Joi.string(),
    });

    static readonly checkout = Joi.object({
        coupon_code: Joi.string(),
        address_id: Joi.string().custom(idValidate),
    });

    static readonly list = Joi.object({
        pageSize: Joi.number().min(0).max(100),
        pageNumber: Joi.number().min(0)
    });
};