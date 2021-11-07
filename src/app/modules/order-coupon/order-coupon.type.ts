import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBOrderCoupon extends IBCommon {
    order_product_id: string
    order_id: string
    type: boolean
    discount: number
    min_cart_amount: number
    offer_start_date: Date
    offer_end_date: Date
}

interface IOrderCoupon extends Optional<IBOrderCoupon, 'order_product_id'> { }

interface IMOrderCoupon extends Model<IBOrderCoupon, IOrderCoupon>, IBOrderCoupon, IMCommon { }

export { IOrderCoupon, IMOrderCoupon };

