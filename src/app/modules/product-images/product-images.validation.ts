import { BaseValidation } from "../BaseValidation";

export abstract class ProductImagesValidation extends BaseValidation {
    // static readonly addImage = Joi.object<IImage>({
    //     image_id: Joi.string(),
    //     product_id: Joi.string(),
    //     image_URL: Joi.string().required(),
    // });

    // static readonly addImageBulk = Joi.array().items(this.addImage)

    // static readonly editImage = Joi.object<IImage>({
    //     image_id: Joi.string(),
    //     product_id: Joi.string(),
    //     image_URL: Joi.string(),
    //     is_active: Joi.boolean()
    // });
};