import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IOrderCoupon } from "./order-coupon.type";

export abstract class OrderCouponValidation extends BaseValidation {
    static readonly addOrderCoupon = Joi.object<IOrderCoupon>({
        order_product_id: Joi.string(),
        order_id: Joi.string(),
        type: Joi.boolean().required(),
        discount: Joi.number().required(),
        min_cart_amount: Joi.number().required(),
        offer_start_date: Joi.date(),
        offer_end_date: Joi.date(),
    });

    static readonly addOrderCouponBulk = Joi.array().items(this.addOrderCoupon)

    static readonly editOrderCoupon = Joi.object<IOrderCoupon>({
        order_product_id: Joi.string(),
        type: Joi.string(),
        discount: Joi.string(),
        min_cart_amount: Joi.number(),
        offer_start_date: Joi.date(),
        offer_end_date: Joi.date(),
    });
};