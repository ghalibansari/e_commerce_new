import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { ICoupon } from "../coupon/coupon.type";
import { IOrderStatus } from "../order-status/order-status.types";
import { IUserAddress } from "../user-address/user-address.type";
import { IUser } from "../user/user.types";

export interface IBOrder extends IBCommon {
    order_id: string
    order_number: string,
    user_id: IUser['user_id']
    transaction_id: string | null
    grand_total: number
    shipping_charges: number
    type: string
    current_status: IOrderStatus['status_id']
    appcode: string
}

export interface IOrder extends Optional<IBOrder, 'order_id'> { }

export interface IMOrder extends Model<IBOrder, IOrder>, IBOrder, IMCommon { }

export interface IPrepareOrder {
    user_id: Required<Pick<IUser, 'user_id'>>['user_id']
    coupon_code?: ICoupon['name']
    address_id?: IUserAddress['address_id']
}

