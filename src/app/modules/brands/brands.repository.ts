import { BaseRepository } from "../BaseRepository";
import { brandsMd } from "./brands.model";
import { IBrands, IMBrands } from "./brands.types";

export class BrandRepository extends BaseRepository<IBrands, IMBrands> {
    constructor() {
        super(brandsMd, 'brand_id', ['*'], [['created_at', 'ASC']], []);
    }
}