import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { ICoupon } from "./coupon.type";

export abstract class CouponValidation extends BaseValidation {
    // static readonly addCoupon = Joi.object<ICoupon>({
    //     coupon_id: Joi.string(),
    //     name: Joi.string().required(),
    //     type: Joi.boolean().required(),
    //     discount: Joi.number().required(),
    //     min_cart_amount: Joi.number().required().min(0),
    //     max_discount_amount: Joi.number().required(),
    //     offer_start_date: Joi.date(),
    //     offer_end_date: Joi.date(),
    // });

    // static readonly addCouponBulk = Joi.array().items(this.addCoupon)

    static readonly applyCoupon = Joi.object<ICoupon>({
        name: Joi.string().required()
    });
};