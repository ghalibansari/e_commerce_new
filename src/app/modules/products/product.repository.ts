
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

    findMinMax = async (columnName: string = 'amount') => {
        // return await ProductMd.findAll({})
        return await ProductMd.findAll({
            attributes: [
                [fn('max', col(columnName)), 'max'],
                [fn('min', col(columnName)), 'min'],
            ]
        })
    }
};