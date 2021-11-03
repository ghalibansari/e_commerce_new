import { BaseRepository } from "../BaseRepository";
import { bannerMd } from "./banner.model";
import { IBanner, IMBanner } from "./banner.types";

export class BrandRepository extends BaseRepository<IBanner, IMBanner> {
    constructor() {
        super(bannerMd, 'banner_id', ['*'], [['created_at', 'ASC']], []);
    }
}