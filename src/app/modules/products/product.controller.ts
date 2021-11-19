import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { ProductRepository } from "./product.repository";
import { IMProduct, IProduct } from "./product.type";
import { ProductValidation } from "./product.validation";


export class ProductController extends BaseController<IProduct, IMProduct> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("product", new ProductRepository(), ['category_id', 'product_id', 'name'], [['amount', 'DESC']], [],)
        this.init()
    };

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/similar-products", TryCatch.tryCatchGlobe(this.similarProducts));

        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(ProductValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(ProductValidation.addProduct), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(ProductValidation.addProductBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(ProductValidation.findById), validateBody(ProductValidation.editProduct), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(ProductValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC));


    };


    similarProducts = async (req: Request, res: Response): Promise<void> => {
        const { query: { category_id, limit } }: any = req;
        const data = await new ProductRepository().similarRandomProducts({ category_id, limit: limit || 10 });
        res.locals = { data, message: Messages.FETCH_SUCCESSFUL, status: true }
        return await JsonResponse.jsonSuccess(req, res, "similarProducts");

    };
};
