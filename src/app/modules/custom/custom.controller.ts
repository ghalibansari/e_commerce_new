import { Application, Request, Response, Router } from "express";
import { Op } from "sequelize";
import { Messages } from "../../constants";
import { JsonResponse, TryCatch, validateQuery } from "../../helper";
import { BrandMd } from "../brand/brand.model";
import { BrandRepository } from "../brand/brand.repository";
import { CategoriesMd } from "../categories/categories.model";
import { CategoriesRepository } from "../categories/categories.repository";
import { ProductImagesMd } from "../product-images/product-images.model";
import { ProductRepository } from "../products/product.repository";
import { UnitMasterMd } from "../unit-master/unit-master.model";
import { CustomRepository } from "./custom.repository";
import { CustomValidation } from "./custom.validation";

export class CustomController {
    router;

    constructor() {
        this.router = Router();
        this.init();
    }

    register = (express: Application) => express.use(`/api/v1`, this.router);

    init() {
        this.router.get("/home", TryCatch.tryCatchGlobe(this.home));
        this.router.get("/filter", TryCatch.tryCatchGlobe(this.filter));

        this.router.get("/test", TryCatch.tryCatchGlobe(this.test));
        this.router.get("/shop", TryCatch.tryCatchGlobe(this.shop)); //todo amir validation
        this.router.get("/search", validateQuery(CustomValidation.search), TryCatch.tryCatchGlobe(this.search));
    }

    home = async (req: Request, res: Response): Promise<void> => {
        const data = await new CustomRepository().home();
        res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, `homePage`);
    };

    test = async (req: Request, res: Response): Promise<void> => {
        // const lal = await new UserRepository().findBulkBR({ include: [{ model: AuthMd, as: 'xxx' }] });
        const lal = await new CategoriesRepository().findBulkBR({
            where: { show_on_home_screen: true, parent_id: null },
            include: [
                {
                    model: CategoriesMd,
                    as: "sub_cat",
                    attributes: ["category_name", "parent_id"],
                },
            ],
            attributes: ["category_name", "parent_id"],
            order: [],
        });
        res.locals = {
            status: true,
            data: { lal },
            message: Messages.FETCH_SUCCESSFUL,
        };
        return await JsonResponse.jsonSuccess(req, res, `homePage`);
    };


    filter = async (req: Request, res: Response): Promise<void> => {
        const data = await new CustomRepository().filter();
        res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, `filter`);
    };


    search = async (req: Request, res: Response): Promise<void> => {
        const { search } = req.query;
        const CategoriesRepo = new CategoriesRepository();

        const [product, category, brand] = await Promise.all([
            await new ProductRepository().findBulkBR({ where: { [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { description: { [Op.like]: `%${search}%` } }] }, attributes: ['product_id', 'name', 'description'] }),
            await CategoriesRepo.findBulkBR({ where: { category_name: { [Op.iLike]: `%${search}%` } }, include: [{ model: CategoriesRepo._model, as: 'sub_cat', where: { is_active: true }, attributes: ['category_id'], required: false }], attributes: ['category_id', 'category_name', 'parent_id'] }),
            await new BrandRepository().findBulkBR({ where: { brand_name: { [Op.iLike]: `%${search}%` } }, attributes: ['brand_id', "brand_name"] }),
        ])
        const data = { product, category, brand };
        res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, `filter`);
    };


    shop = async (req: Request, res: Response): Promise<void> => {
        let {
            order,
            pageSize,
            pageNumber,
            category_id,
            minAmount,
            maxAmount,
            brand_id
        }: any = req.query;

        let where: any = {};
        let brandWhere: any = { is_active: true };
        let categoryWhere: any = { is_active: true };
        const attributes: string[] = ["name", "description", "selling_price", "weight", 'out_of_stock', 'base_price'];
        order ||= order;
        pageNumber ||= pageNumber;
        pageSize ||= pageSize;



        if (minAmount || maxAmount) {
            where[Op.and] = [];
            if (minAmount) where[Op.and].push({ amount: { [Op.gte]: minAmount } });
            if (maxAmount) where[Op.and].push({ amount: { [Op.lte]: maxAmount } });
        }

        if (category_id) {
            category_id = JSON.parse(category_id);
            categoryWhere["category_id"] = category_id;
        }
        if (brand_id) {
            brand_id = JSON.parse(brand_id);
            brandWhere["brand_id"] = brand_id;
        }

        if (order) {
            order = JSON.parse(order)
        }

        const include = [
            {
                model: BrandMd,
                as: "brand",
                attributes: ["brand_name", "brand_id"],
                where: brandWhere,
            },
            {
                model: CategoriesMd,
                as: "category",
                attributes: ["category_name", "category_id"],
                where: categoryWhere,
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

        const { page, data } = await new ProductRepository().indexBR({
            where,
            order,
            pageNumber,
            pageSize,
            include,
            //@ts-expect-error
            attributes
        });
        res.locals = {
            status: true,
            page,
            data,
            message: Messages.FETCH_SUCCESSFUL,
        };
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.indexBC`);
    };
}
