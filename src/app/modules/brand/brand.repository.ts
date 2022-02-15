import { BaseRepository } from "../BaseRepository";
import { BrandMd } from "./brand.model";
import { IBrand, IMBrand } from "./brand.types";

export class BrandRepository extends BaseRepository<IBrand, IMBrand> {
    constructor() {
        super(BrandMd, 'brand_id', ['*'], [['created_at', 'ASC']], []);
    }
};