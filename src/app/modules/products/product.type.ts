import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBProduct extends IBCommon {
    product_id: string
    category_id: string
    brand_id: string
    name: string
    description: string
    weight: number
    amount: number
}

interface IProduct extends Optional<IBProduct, 'product_id'> { }

interface IMProduct extends Model<IBProduct, IProduct>, IBProduct, IMCommon { }

export { IProduct, IMProduct };

