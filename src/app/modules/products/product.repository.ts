import { BaseRepository } from "../BaseRepository";
import { ProductMd } from "./product.model";
import { IMProduct, IProduct } from "./product.type";

export class ProductRepository extends BaseRepository<IProduct, IMProduct> {
    constructor() {
        super(ProductMd, 'product_id', ['*'], ['amount'], []);
    }
}