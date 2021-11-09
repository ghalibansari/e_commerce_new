import { BaseRepository } from "../BaseRepository";
import { CartMd } from "./cart.model";
import { ICart, IMCart } from "./cart.types";

export class CartRepository extends BaseRepository<ICart, IMCart> {
    constructor() {
        super(CartMd, 'cart_id', ['*'], ['created_at'], []);
    }
}