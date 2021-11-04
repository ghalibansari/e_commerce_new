import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { ProductRepository } from "./product.repository";
import { IMProduct, IProduct } from "./product.type";
import { ProductValidation } from "./productvalidation";


export class ProductController extends BaseController<IProduct, IMProduct> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("product", new ProductRepository(), ['category_id', 'product_id', 'name'], [['amount', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(ProductValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(ProductValidation.addProduct), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(ProductValidation.addProductBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(ProductValidation.findById), validateBody(ProductValidation.editProduct), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(ProductValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
