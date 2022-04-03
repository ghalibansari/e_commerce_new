
import { DB } from "../../../configs/DB";
import { BaseRepository } from "../BaseRepository";
import { BrandMd } from "../brand/brand.model";
import { CategoriesMd } from "../categories/categories.model";
import { ICategories } from "../categories/categories.type";
import { ProductImagesMd } from "../product-images/product-images.model";
import { UnitMasterMd } from "../unit-master/unit-master.model";
import { ProductMd } from "./product.model";
import { IMProduct, IProduct } from "./product.type";


const { fn, col, literal, random } = DB

export class ProductRepository extends BaseRepository<IProduct, IMProduct> {
    constructor() {
        super(ProductMd, 'product_id', ['*'], [], []);
    }

    similarRandomProducts = async ({ category_id, limit }: { category_id: ICategories['category_id'], limit: number }) => {
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
        return await this.findBulkBR({ where: { category_id }, order: [literal('RANDOM()'), literal('RANDOM()')], limit, attributes, include })//
    };

};