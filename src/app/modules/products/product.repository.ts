
import { DB } from "../../../configs/DB";
import { BaseRepository } from "../BaseRepository";
import { ICategories } from "../categories/categories.type";
import { ProductMd } from "./product.model";
import { IMProduct, IProduct } from "./product.type";


const { fn, col, literal, random } = DB

export class ProductRepository extends BaseRepository<IProduct, IMProduct> {
    constructor() {
        super(ProductMd, 'product_id', ['*'], [], []);
    }

    similarRandomProducts = async ({ category_id, limit }: { category_id: ICategories['category_id'], limit: number }) => {
        //@ts-expect-error
        return await this.findBulkBR({ where: { category_id }, order: [literal('RANDOM()'), literal('RANDOM()')], limit, attributes: ['product_id', 'category_id', "name"] })//
    };

};