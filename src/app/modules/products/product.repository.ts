
import { DB } from "../../../configs/DB";
import { BaseRepository } from "../BaseRepository";
import { ProductMd } from "./product.model";
import { IMProduct, IProduct } from "./product.type";

//@ts-expect-error
const { fn, col } = DB

export class ProductRepository extends BaseRepository<IProduct, IMProduct> {
    constructor() {
        super(ProductMd, 'product_id', ['*'], ['amount'], []);
    }


}; 