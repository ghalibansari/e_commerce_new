import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { OrderAddressRepository } from "./order-address.repository";
import { IMOrderAddress, IOrderAddress } from "./order-address.types";
import { OrderAddressValidation } from "./order-address.validation";


export class OrderAddressController extends BaseController<IOrderAddress, IMOrderAddress> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("order-address", new OrderAddressRepository(), [''], [['order_address_id', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(OrderAddressValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(OrderAddressValidation.addOrderAddress), TryCatch.tryCatchGlobe(this.createOneBC))
        // this.router.post("/bulk", validateBody(OrderAddressValidation.addOrderAddressBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(OrderAddressValidation.findById), validateBody(OrderAddressValidation.editOrderAddress), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(OrderAddressValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
