import { BaseRepository } from "../BaseRepository";
import { OrderProductMd } from "./order-products.model";
import { IMOrderProduct, IOrderProduct } from "./order-products.type";

export class OrderProductRepository extends BaseRepository<IOrderProduct, IMOrderProduct> {
    constructor() {
        super(OrderProductMd, 'order_product_id', ['*'], ['amount'], []);
    }
}