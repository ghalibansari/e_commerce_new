import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

export enum CouponEnum {
    rupees = 'rupees',
    percent = 'percentage',
};


interface IBCoupon extends IBCommon {
    coupon_id: string
    name: string
    type: CouponEnum
    discount: number
    min_cart_amount: number
    offer_start_date: Date
    offer_end_date: Date
    max_discount_amount: number
}

interface ICoupon extends Optional<IBCoupon, 'coupon_id'> { }

interface IMCoupon extends Model<IBCoupon, ICoupon>, IBCoupon, IMCommon { }

export { ICoupon, IMCoupon };

