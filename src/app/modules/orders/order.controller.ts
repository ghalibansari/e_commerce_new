import { Application, Request, Response } from "express";
import { AuthGuard, DBTransaction, JsonResponse, randomAlphaNumeric, TryCatch, validateBody } from "../../helper";
import { BaseController } from "../BaseController";
import { CouponRepository } from "../coupon/coupon.repository";
import { UserAddressRepository } from "../user-address/user-address.repository";
import { OrderRepository } from "./order.repository";
import { CartRepository } from "../cart/cart.repository";
import { IMOrder, IOrder } from "./order.type";
import { OrderValidation } from "./order.validation";
import { Constant, Messages } from "../../constants";
import { ProductRepository } from "../products/product.repository";
import { BrandMd } from "../brand/brand.model";
import { CategoriesMd } from "../categories/categories.model";
import { UnitMasterMd } from "../unit-master/unit-master.model";
import { ProductImagesMd } from "../product-images/product-images.model";

// @ts-expect-error
export class OrderController extends BaseController<IOrder, IMOrder, OrderRepository> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("order", new OrderRepository(), ['transaction_id', 'grand_total', 'shipping_charges', 'type'], [['created_at', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        // this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(OrderValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/place-order", validateBody(OrderValidation.placeOrder), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.placeOrder))
        this.router.post("/checkout", validateBody(OrderValidation.checkout), TryCatch.tryCatchGlobe(this.checkout))
        // this.router.post("/bulk", validateBody(OrderValidation.addOrderBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(OrderValidation.findById), validateBody(OrderValidation.editOrder), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(OrderValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }

    /**
     * order summary
     * @param req 
     * @param res 
     */
    checkout = async (req: Request, res: Response): Promise<void> => {
        const { user: { user_id }, body: { address_id, coupon_code } }: any = req;
        
        const data = await this.repo.orderCheckout({ user_id, coupon_code, address_id });

        res.locals = { data, message: Messages.FETCH_SUCCESSFUL, status: true }
        return await JsonResponse.jsonSuccess(req, res, "checkout");
    }

    /**
     * prepare order data
    */
    placeOrder = async (req: Request, res: Response): Promise<void> => {
        const {transaction, user: { user_id }, body: { address_id, coupon_code } }: any = req;
        
        const data = await this.repo.placeOrder({ user_id, coupon_code, address_id, transaction });

        res.locals = { data, message: Messages.ORDER_PLACED_SUCCESSFULLY, status: true }
        return await JsonResponse.jsonSuccess(req, res, "checkout");
    };
};