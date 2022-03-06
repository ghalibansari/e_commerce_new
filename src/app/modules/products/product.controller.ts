import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { JsonResponse, TryCatch, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { BrandMd } from "../brand/brand.model";
import { CategoriesMd } from "../categories/categories.model";
import { ProductImagesMd } from "../product-images/product-images.model";
import { UnitMasterMd } from "../unit-master/unit-master.model";
import { ProductRepository } from "./product.repository";
import { IMProduct, IProduct } from "./product.type";
import { ProductValidation } from "./product.validation";


export class ProductController extends BaseController<IProduct, IMProduct> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("product", new ProductRepository(), ['category_id', 'product_id', 'name', "weight", "selling_price", "description"], [['created_at', 'DESC']], [],)
        this.init()
    };

    register = (express: Application) => express.use(`/api/v1/${this.url}`, this.router)

    init() {
        this.router.get("/similar-products", TryCatch.tryCatchGlobe(this.similarProducts));

        // this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(ProductValidation.findById), TryCatch.tryCatchGlobe(this.findById))
        // this.router.post("/", validateBody(ProductValidation.addProduct), TryCatch.tryCatchGlobe(this.createOneBC))
        // this.router.post("/bulk", validateBody(ProductValidation.addProductBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(ProductValidation.findById), validateBody(ProductValidation.editProduct), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(ProductValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC));


    };

    findById = async (req: Request, res: Response): Promise<void> => {
        const { params: { id } }: any = req
        const attributes = ["name", "description", "selling_price", "weight", 'out_of_stock', 'base_price'];
        const include = [
            {
                model: BrandMd,
                as: "brand",
                attributes: ["brand_name", "brand_id"],
                where: { is_active: true },
            },
            {
                model: CategoriesMd,
                as: "category",
                attributes: ["category_name", "category_id"],
                where: { is_active: true },
            },
            {
                model: ProductImagesMd,
                as: "images",
                attributes: ["image_url"],
                where: { is_active: true },
                limit: 1
            },
            {
                model: UnitMasterMd,
                as: "unit",
                attributes: ["name"]
            }
        ];
        //@ts-expect-error
        const data = await this.repo.findByIdBR({ id, attributes, include, raw: false });
        res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdBC`)
    };


    similarProducts = async (req: Request, res: Response): Promise<void> => {
        const { query: { category_id, limit } }: any = req;
        const data = await new ProductRepository().similarRandomProducts({ category_id, limit: limit || 10 });
        res.locals = { data, message: Messages.FETCH_SUCCESSFUL, status: true }
        return await JsonResponse.jsonSuccess(req, res, "similarProducts");

    };
};
