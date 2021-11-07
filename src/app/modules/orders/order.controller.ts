import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { OrderRepository } from "./order.repository";
import { IMOrder, IOrder } from "./order.type";
import { OrderValidation } from "./order.validation";

export class OrderController extends BaseController<IOrder, IMOrder> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("order", new OrderRepository(), ['transaction_id', 'grand_total', 'shipping_charges', 'status'], [['status', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(OrderValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(OrderValidation.addOrder), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(OrderValidation.addOrderBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(OrderValidation.findById), validateBody(OrderValidation.editOrder), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(OrderValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};