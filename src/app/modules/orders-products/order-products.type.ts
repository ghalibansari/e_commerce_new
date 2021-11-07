import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBOrderProduct extends IBCommon {
    order_product_id: string
    order_id: string
    product_id: string
    quantity: number
    amount: number
}

interface IOrderProduct extends Optional<IBOrderProduct, 'order_product_id'> { }

interface IMOrderProduct extends Model<IBOrderProduct, IOrderProduct>, IBOrderProduct, IMCommon { }

export { IMOrderProduct, IOrderProduct };

