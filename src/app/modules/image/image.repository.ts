import { BaseRepository } from "../BaseRepository";
import { ImageMd } from "./image.model";
import { IImage, IMImage } from "./image.type";

export class ImageRepository extends BaseRepository<IImage, IMImage> {
    constructor() {
        super(ImageMd, 'image_id', ['*'], ['updated_at'], []);
    }
}