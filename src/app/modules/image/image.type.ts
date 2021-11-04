import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBImage extends IBCommon {
    image_id: string
    product_id: string
    image_URL: string
}

interface IImage extends Optional<IBImage, 'image_id'> { }

interface IMImage extends Model<IBImage, IImage>, IBImage, IMCommon { }

export { IImage, IMImage };

