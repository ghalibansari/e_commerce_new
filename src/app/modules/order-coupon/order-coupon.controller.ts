import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { OrderCouponRepository } from "./order-coupon.repository";
import { IMOrderCoupon, IOrderCoupon } from "./order-coupon.type";
import { OrderCouponValidation } from "./order-coupon.validation";

export class OrderCouponController extends BaseController<IOrderCoupon, IMOrderCoupon> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("order_coupon", new OrderCouponRepository(), ['order_product_id', 'type', 'min_cart_amount'], [['type', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(OrderCouponValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(OrderCouponValidation.addOrderCoupon), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(OrderCouponValidation.addOrderCouponBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(OrderCouponValidation.findById), validateBody(OrderCouponValidation.editOrderCoupon), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(OrderCouponValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};