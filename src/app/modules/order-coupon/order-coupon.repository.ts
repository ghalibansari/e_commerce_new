import { BaseRepository } from "../BaseRepository";
import { OrderCouponMd } from "./order-coupon.model";
import { IMOrderCoupon, IOrderCoupon } from "./order-coupon.type";

export class OrderCouponRepository extends BaseRepository<IOrderCoupon, IMOrderCoupon> {
    constructor() {
        super(OrderCouponMd, 'order_product_id', ['*'], ['type'], []);
    }
}