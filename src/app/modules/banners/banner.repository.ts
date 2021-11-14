import { BaseRepository } from "../BaseRepository";
import { BannerMd } from "./banner.model";
import { IBanner, IMBanner } from "./banner.types";

export class BannerRepository extends BaseRepository<IBanner, IMBanner> {
    constructor() {
        super(BannerMd, 'banner_id', ['*'], [['created_at', 'ASC']], []);
    }
}