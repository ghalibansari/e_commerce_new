import { Application, Request, Response } from "express";
import { Op } from "sequelize";
import { Messages } from "../../constants";
import { AuthGuard, JsonResponse, TryCatch, validateQuery } from "../../helper";
import { BaseController } from "../BaseController";
import { ProductRepository } from '../products/product.repository';
import { CartRepository } from './../cart/cart.repository';
import { CouponRepository } from "./coupon.repository";
import { CouponEnum, ICoupon, IMCoupon } from "./coupon.type";
import { CouponValidation } from "./coupon.validation";

export class CouponController extends BaseController<ICoupon, IMCoupon> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("coupon", new CouponRepository(), ['coupon_id', 'type', 'min_cart_amount'], [['type', 'DESC']], [],)
        this.init()
    };

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        // this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(CouponValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.get("/apply-coupon", validateQuery(CouponValidation.applyCoupon), TryCatch.tryCatchGlobe(this.applyCoupon))
        // this.router.post("/bulk", validateBody(CouponValidation.addCouponBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(CouponValidation.findById), validateBody(CouponValidation.editCoupon), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(CouponValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    };

    applyCoupon = async (req: Request, res: Response): Promise<void> => {
        const { query: { name }, user: { user_id } }: any = req;
        const now = Date.now()

        const coupon = await new CouponRepository().findOneBR({ where: { name, offer_start_date: { [Op.lte]: now }, offer_end_date: { [Op.gte]: now } }, attributes: ["discount", "coupon_id", "min_cart_amount", "type", "offer_end_date", "offer_start_date", "max_discount_amount"] })
        if (!coupon) { throw new Error("Invalid Coupon") };

        const ProductRepo = new ProductRepository()
        const include = [{ model: ProductRepo._model, as: "product", attributes: ['name', 'amount', 'product_id'] }];
        const carts = await new CartRepository().findBulkBR({ where: { user_id }, attributes: ["quantity"], include });

        let cartTotalAmount = 0;

        for (let i = 0; i < carts.length; i++) {
            //@ts-expect-error
            const amount = carts[i].product.amount * carts[i].quantity
            cartTotalAmount = cartTotalAmount + amount;
        }

        let discountAmount = 0;
        if (coupon.type === CouponEnum.percent) {
            discountAmount = (cartTotalAmount / 100) * coupon.discount
            if (discountAmount > coupon.max_discount_amount) discountAmount = coupon.max_discount_amount
        } else if (coupon.type === CouponEnum.rupees) {
            discountAmount = coupon.discount
        }

        if (cartTotalAmount < coupon.min_cart_amount) throw new Error(`Coupan can be only applicable on minimum amount: ${coupon.min_cart_amount}`);
        const totalAmount = cartTotalAmount - discountAmount
        const data = { carts, coupon, discountAmount, totalAmount }

        res.locals = { status: true, message: Messages.SUCCESS, data };
        return JsonResponse.jsonSuccess(req, res, "applyCoupon")
    }


};