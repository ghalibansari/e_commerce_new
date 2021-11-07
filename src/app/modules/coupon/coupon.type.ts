import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBCoupon extends IBCommon {
    coupon_id: string
    type: boolean
    discount: number
    min_cart_amount: number
    offer_start_date: Date
    offer_end_date: Date
}

interface ICoupon extends Optional<IBCoupon, 'coupon_id'> { }

interface IMCoupon extends Model<IBCoupon, ICoupon>, IBCoupon, IMCommon { }

export { ICoupon, IMCoupon };

