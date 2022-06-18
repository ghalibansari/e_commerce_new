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
        const { query: { name }, user_id: { user_id } }: any = req;
        
        const data = await new CouponRepository().applyCoupon({ user_id,name })

        res.locals = { status: true, message: Messages.SUCCESS, data };
        return JsonResponse.jsonSuccess(req, res, "applyCoupon")
    }


};