import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IBrand } from "../brand/brand.types";
import { ICategories } from "../categories/categories.type";
import { ITag } from "../tags/tags.types";

interface IBProduct extends IBCommon {
    product_id: string
    category_id: ICategories['category_id']
    brand_id: IBrand['brand_id']
    tag_id: ITag['tag_id']
    name: string
    description: string
    weight: number
    base_price: number
    selling_price: number
    code: string
    out_of_stock: boolean
    unit_id: string
}

interface IProduct extends Optional<IBProduct, 'product_id'> { }

interface IMProduct extends Model<IBProduct, IProduct>, IBProduct, IMCommon { }

export { IProduct, IMProduct };

