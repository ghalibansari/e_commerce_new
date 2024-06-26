import { Transaction } from "sequelize/types";
import { Constant, Errors } from '../../constants';
import { BaseRepository } from "../BaseRepository";
import { IProduct } from "../products/product.type";
import { IUser } from "../user/user.types";
import { WishlistRepository } from "../wishlist/wishlist.repository";
import { ProductRepository } from './../products/product.repository';
import { CartMd } from "./cart.model";
import { ICart, IMCart } from "./cart.types";


export class CartRepository extends BaseRepository<ICart, IMCart> {
    constructor() {
        super(CartMd, 'cart_id', ['*'], ['created_at'], []);
    }

    addToCart = async ({ product_id, quantity, user_id, transaction }: { product_id: IProduct['product_id'], quantity: ICart['quantity'], user_id: IUser['user_id'], transaction?: Transaction }) => {
        const [cart, product] = await Promise.all([
            this.findOneBR({ where: { user_id, product_id }, attributes: ['cart_id', 'quantity'] }),
            new ProductRepository().findOneBR({ where: { product_id, out_of_stock: false }, attributes: ['product_id', 'quantity'] })
        ]);
        if (!product) throw new Error(Errors.INVALID_PRODUCT_ID)
        if (product.out_of_stock) throw new Error(Errors.PRODUCT_OUT_OF_STOCK)

        if (!quantity) {
            if (cart?.quantity) {
                quantity = cart.quantity + 1;
            } else {
                quantity = 1;
            }
        }

        if(product.quantity < quantity) throw new Error(`Only ${product.quantity} quantity left. Can't add more quantity`)

        if (cart) await this.updateByIdBR({ id: cart.cart_id, newData: { quantity }, updated_by: user_id, transaction });
        else await this.createOneBR({ newData: { product_id, user_id, quantity }, created_by: user_id, transaction });
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


    index = async ({
        where = {},
        attributes = this.attributes,
        include = this.include,
        order = this.order,
        pageNumber = Constant.DEFAULT_PAGE_NUMBER,
        pageSize = Constant.DEFAULT_PAGE_SIZE
    }): Promise<any> => {
        let offset, limit, totalPage = 0, hasNextPage = false

        const [totalCount, count] = await Promise.all([
            //@ts-expect-error
            this.CountAllBR({where : { user_id: where.user_id }, include}),
            this.CountBR({where, include})
        ])

        //calculate pagination.
        totalPage = (count % pageSize === 0) ? count / pageSize : Math.ceil(count / pageSize)
        offset = (pageNumber - 1) * pageSize
        limit = pageNumber * pageSize
        if (limit < count) hasNextPage = true;
        const carts = await this.findBulkBR({ where, attributes, order, offset, limit, include });
        let totalAmount = 0;

        for (let i = 0; i < carts.length; i++) {
            //@ts-expect-error
            const amount = carts[i].product.selling_price * carts[i].quantity
            totalAmount = totalAmount + amount;
        }
        return { data: { carts, totalAmount }, page: { hasNextPage, totalCount, currentPage: pageNumber, totalPage } }
    };

    getCartTotalAmount = async ({user_id}:{user_id:string}): Promise<{carts: IMCart[]; cartTotalAmount: number;}> => {
        const ProductRepo = new ProductRepository()
        const include = [{ model: ProductRepo._model, as: "product", attributes: ['name', 'selling_price', 'product_id'], where: {is_active: true} }];
        const carts = await this.findBulkBR({ where: { user_id }, attributes: ["quantity"], include });

        if(!carts.length){
            throw new Error(Errors.EMPTY_CART);
        }

        let cartTotalAmount = 0;

        for (let i = 0; i < carts.length; i++) {
            //@ts-expect-error
            const selling_price = carts[i].product.selling_price * carts[i].quantity
            cartTotalAmount = cartTotalAmount + selling_price;
        }

        const data = { carts, cartTotalAmount }   

        return data;
    }
};