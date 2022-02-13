import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBProductImages extends IBCommon {
    image_id: string
    product_id: string
    image_URL: string
}

interface IProductImages extends Optional<IBProductImages, 'image_id'> { }

interface IMProductImages extends Model<IBProductImages, IProductImages>, IBProductImages, IMCommon { }

export { IProductImages as IImage, IMProductImages as IMImage };

