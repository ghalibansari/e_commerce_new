import { Op } from "sequelize";
import { BaseRepository } from "../BaseRepository";
import { CartRepository } from "../cart/cart.repository";
import { IMCart } from "../cart/cart.types";
import { CouponMd } from "./coupon.model";
import { CouponEnum, ICoupon, IMCoupon } from "./coupon.type";

export class CouponRepository extends BaseRepository<ICoupon, IMCoupon> {
    constructor() {
        super(CouponMd, 'coupon_id', ['*'], ['type'], []);
    }

    applyCoupon = async ({name, user_id}:{name:string, user_id:string}): Promise<{carts: IMCart[]; coupon: IMCoupon; discountAmount: number; totalAmount: number;}> => {
        const now = Date.now()

        const coupon = await new CouponRepository().findOneBR({ where: { name, offer_start_date: { [Op.lte]: now }, offer_end_date: { [Op.gte]: now } }, attributes: ["discount", "coupon_id", "min_cart_amount", "type", "offer_end_date", "offer_start_date", "max_discount_amount"] })
        if (!coupon) { throw new Error("Invalid Coupon") };

        let {cartTotalAmount,carts} = await new CartRepository().getCartTotalAmount({ user_id });

        let discountAmount = 0;
        if (coupon.type === CouponEnum.percent) {
            discountAmount = (cartTotalAmount / 100) * coupon.discount
            if (discountAmount > coupon.max_discount_amount) discountAmount = coupon.max_discount_amount
        } else if (coupon.type === CouponEnum.rupees) {
            discountAmount = coupon.discount
        }

        if (cartTotalAmount < coupon.min_cart_amount) throw new Error(`Coupan can be only applicable on minimum amount: ${coupon.min_cart_amount}`);
        const totalAmount = cartTotalAmount - discountAmount
        const data = { carts, coupon, discountAmount, totalAmount };      
        
        return data;
    }

    checkCoupon = async ({ coupon_code }: { coupon_code: string }): Promise<IMCoupon> => {
        const now = Date.now()

        const coupon = await this.findOneBR({ where: { name: coupon_code, offer_start_date: { [Op.lte]: now }, offer_end_date: { [Op.gte]: now } }, attributes: ["discount", "coupon_id", "min_cart_amount", "type", "offer_end_date", "offer_start_date", "max_discount_amount"] })
        if (!coupon) { throw new Error("Invalid Coupon") };     
        
        return coupon;
    }
}