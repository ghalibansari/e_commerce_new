import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { OrderProductRepository } from "./order-products.repository";
import { IMOrderProduct, IOrderProduct } from "./order-products.type";
import { OrderProductValidation } from "./order-products.validation";

export class OrderProductController extends BaseController<IOrderProduct, IMOrderProduct> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("order-product", new OrderProductRepository(), ['order_product_id', 'order_id', 'quantity', 'amount'], [['quantity', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(OrderProductValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(OrderProductValidation.addOrderProduct), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(OrderProductValidation.addOrderProductBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(OrderProductValidation.findById), validateBody(OrderProductValidation.editOrderProduct), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(OrderProductValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};