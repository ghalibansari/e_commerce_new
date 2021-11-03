import { BaseRepository } from "../BaseRepository";
import { BrandsMd } from "./brands.model";
import { IBrands, IMBrands } from "./brands.types";

export class BrandRepository extends BaseRepository<IBrands, IMBrands> {
    constructor() {
        super(BrandsMd, 'brand_id', ['*'], [['created_at', 'ASC']], []);
    }
}