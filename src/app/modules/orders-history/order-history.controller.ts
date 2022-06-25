import { Application } from "express";
import { AuthGuard } from "../../helper";
import { BaseController } from "../BaseController";
import { OrderHistoryRepository } from "./order-history.repository";
import { IMOrderHistory, IOrderHistory } from "./order-history.type";

export class OrderHistoryController extends BaseController<IOrderHistory, IMOrderHistory> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("order", new OrderHistoryRepository(), ['order_id', 'status_id', 'comment'], [['created_at', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        // this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(OrderValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        //this.router.post("/place-order",validateBody(OrderValidation.placeOrder) , DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.placeOrder))
        //this.router.post("/checkout",validateBody(OrderValidation.checkout) , TryCatch.tryCatchGlobe(this.checkout))
        // this.router.post("/bulk", validateBody(OrderValidation.addOrderBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(OrderValidation.findById), validateBody(OrderValidation.editOrder), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(OrderValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};