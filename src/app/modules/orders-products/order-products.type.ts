import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IBrand } from "../brand/brand.types";
import { ICategories } from "../categories/categories.type";
import { IProduct } from "../products/product.type";
import { IUnitMaster } from "../unit-master/unit-master.type";
//  Pick<IProduct, '||'>, 
interface IBOrderProduct extends IBCommon {
    order_product_id: string
    order_id: string
    product_id: string
    quantity: number
    base_price: number
    selling_price: number
    category_id: ICategories['category_id']
    brand_id: IBrand['brand_id']
    unit_id: IUnitMaster['unit_id']
    category: string
    brand: string
    unit: string
    weight: number
}

interface IOrderProduct extends Optional<IBOrderProduct, 'order_product_id'> { }

interface IMOrderProduct extends Model<IBOrderProduct, IOrderProduct>, IBOrderProduct, IMCommon { }

export { IMOrderProduct, IOrderProduct };

