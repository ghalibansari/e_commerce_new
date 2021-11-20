import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { CouponRepository } from "./coupon.repository";
import { ICoupon, IMCoupon } from "./coupon.type";
import { CouponValidation } from "./coupon.validation";

export class CouponController extends BaseController<ICoupon, IMCoupon> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("coupon", new CouponRepository(), ['coupon_id', 'type', 'min_cart_amount'], [['type', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        // this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(CouponValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(CouponValidation.addCoupon), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(CouponValidation.addCouponBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(CouponValidation.findById), validateBody(CouponValidation.editCoupon), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(CouponValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};