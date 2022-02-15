import { BaseRepository } from "../BaseRepository";
import { ProductImagesMd } from "./product-images.model";
import { IImage, IMImage } from "./product-images.type";

export class ProductImagesRepository extends BaseRepository<IImage, IMImage> {
    constructor() {
        super(ProductImagesMd, 'image_id', [''], ['updated_at'], []);
    }
}