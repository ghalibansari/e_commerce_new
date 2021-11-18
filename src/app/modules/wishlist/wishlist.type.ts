import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IProduct } from "../products/product.type";
import { IUser } from "../user/user.types";

interface IBWishlist extends IBCommon {
    wishlist_id: string
    product_id: IProduct['product_id']
    user_id: IUser['user_id']
}

interface IWishlist extends Optional<IBWishlist, 'wishlist_id'> { }

interface IMWishlist extends Model<IBWishlist, IWishlist>, IBWishlist, IMCommon { }

export { IWishlist, IMWishlist };

