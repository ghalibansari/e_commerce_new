import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { ICoupon } from "../coupon/coupon.type";
import { IOrder } from "../orders/order.type";

interface IBOrderCoupon extends IBCommon {
    order_coupon_id: string
    order_id: IOrder["order_id"]
    coupon_id: ICoupon["coupon_id"]
    name: string
    type: boolean
    discount: number
    min_cart_amount: number
    discount_amount: number
    offer_start_date: Date
    offer_end_date: Date
}

interface IOrderCoupon extends Optional<IBOrderCoupon, 'order_coupon_id'> { }

interface IMOrderCoupon extends Model<IBOrderCoupon, IOrderCoupon>, IBOrderCoupon, IMCommon { }

export { IOrderCoupon, IMOrderCoupon };

