import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IProduct } from "../products/product.type";
import { IUser } from "../user/user.types";

interface IBCart extends IBCommon {
    cart_id: string
    product_id: IProduct['product_id']
    user_id: IUser['user_id']
    quantity: number
}

interface ICart extends Optional<IBCart, 'cart_id'> { }

interface IMCart extends Model<IBCart, ICart>, IBCart, IMCommon { }

export { ICart, IMCart };

