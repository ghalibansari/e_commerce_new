import { BaseRepository } from "../BaseRepository";
import { BannerMd } from "./banner.model";
import { IBanner, IMBanner } from "./banner.types";

export class BrandRepository extends BaseRepository<IBanner, IMBanner> {
    constructor() {
        super(BannerMd, 'banner_id', ['*'], [['created_at', 'ASC']], []);
    }
}