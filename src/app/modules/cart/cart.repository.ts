import { Transaction } from "sequelize/types";
import { BaseRepository } from "../BaseRepository";
import { IProduct } from "../products/product.type";
import { IUser } from "../user/user.types";
import { WishlistRepository } from "../wishlist/wishlist.repository";
import { CartMd } from "./cart.model";
import { ICart, IMCart } from "./cart.types";

export class CartRepository extends BaseRepository<ICart, IMCart> {
    constructor() {
        super(CartMd, 'cart_id', ['*'], ['created_at'], []);
    }

    addToCart = async ({ product_id, quantity, user_id, transaction }: { product_id: IProduct['product_id'], quantity: ICart['quantity'], user_id: IUser['user_id'], transaction?: Transaction }) => {
        const cart = await this.findOneBR({ where: { user_id, product_id }, attributes: ['cart_id', 'quantity'] });
        if (cart) await this.updateByIdBR({ id: cart.cart_id, newData: { quantity: quantity || cart.quantity++ }, updated_by: user_id, transaction });
        else await this.createOneBR({ newData: { product_id, user_id, quantity: quantity || 1 }, created_by: user_id, transaction });
    }

    removeFromCart = async ({ product_id, user_id, delete_reason = "remove from cart by user", transaction }: { product_id: IProduct['product_id'], user_id: IUser['user_id'], delete_reason?: string, transaction?: Transaction }) => {
        const cart = await this.findOneBR({ where: { user_id, product_id }, attributes: ['cart_id'] });
        if (!cart) throw new Error('Invalid product_id')
        await this.deleteByIdBR({ id: cart.cart_id, delete_reason, deleted_by: user_id, transaction });
    }

    moveToWishList = async ({ product_id, user_id, transaction }: { product_id: IProduct['product_id'], user_id: IUser['user_id'], transaction: Transaction }) => {
        await this.removeFromCart({ product_id, user_id, delete_reason: "move to wishlist", transaction })
        await new WishlistRepository().addToWishlist({ product_id, user_id, transaction })
    }

};