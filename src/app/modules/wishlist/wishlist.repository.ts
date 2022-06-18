import { Transaction } from "sequelize/types";
import { Errors } from "../../constants";
import { BaseRepository } from "../BaseRepository";
import { CartRepository } from "../cart/cart.repository";
import { ProductRepository } from "../products/product.repository";
import { IProduct } from "../products/product.type";
import { IUser } from "../user/user.types";
import { WishlistMd } from "./wishlist.model";
import { IMWishlist, IWishlist } from "./wishlist.type";

export class WishlistRepository extends BaseRepository<IWishlist, IMWishlist> {
    constructor() {
        super(WishlistMd, 'wishlist_id', ['*'], ['created_at'], []);
    }

    addToWishlist = async ({ product_id, user_id, transaction }: { product_id: IProduct['product_id'], user_id: IUser['user_id'], transaction?: Transaction }) => {
        const [wishlist, product] = await Promise.all([
            this.findOneBR({ where: { user_id, product_id }, attributes: ['wishlist_id'] }),
            new ProductRepository().findOneBR({ where: { product_id, out_of_stock: false }, attributes: ['product_id'] })
        ]);
        if (wishlist) throw new Error("Already in Wishlist")
        if (!product) throw new Error(Errors.INVALID_PRODUCT_ID)
        await this.createOneBR({ newData: { product_id, user_id }, created_by: user_id, transaction });
    }

    removeFromWishlist = async ({ product_id, user_id, transaction, delete_reason }: { product_id: IProduct['product_id'], user_id: IUser['user_id'], delete_reason?: string, transaction?: Transaction }) => {
        const wishlist = await this.findOneBR({ where: { user_id, product_id }, attributes: ['wishlist_id'] });
        if (!wishlist) throw new Error('Invalid product_id');
        await this.deleteByIdBR({ id: wishlist.wishlist_id, deleted_by: user_id, delete_reason: 'remove from wishlist by user', transaction });
    }

    moveToCart = async ({ product_id, user_id, transaction }: { product_id: IProduct['product_id'], user_id: IUser['user_id'], transaction: Transaction }) => {
        await this.removeFromWishlist({ product_id, user_id, delete_reason: "move to cart", transaction })
        await new CartRepository().addToCart({ product_id, quantity: 1, user_id, transaction })
    }
}