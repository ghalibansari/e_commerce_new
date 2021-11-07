import { BaseRepository } from "../BaseRepository";
import { CouponMd } from "./coupon.model";
import { ICoupon, IMCoupon } from "./coupon.type";

export class CouponRepository extends BaseRepository<ICoupon, IMCoupon> {
    constructor() {
        super(CouponMd, 'coupon_id', ['*'], ['type'], []);
    }
}