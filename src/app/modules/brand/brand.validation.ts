import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IBrand } from './brand.types';


export class BrandValidation extends BaseValidation {
    static readonly addBrand = Joi.object<IBrand>({
        brand_name: Joi.string().required(),
        order_sequence: Joi.number(),
        show_on_home_screen: Joi.boolean(),
        banner_image: Joi.string(),
        show_on_header: Joi.boolean(),
        tag_id: Joi.string(),


    });


    static readonly addBrandBulk = Joi.array().items(this.addBrand);


    static readonly editBrand = Joi.object<IBrand>({
        brand_name: Joi.string(),
        is_active: Joi.boolean(),
        order_sequence: Joi.number(),
        show_on_home_screen: Joi.boolean(),
        banner_image: Joi.string(),
        show_on_header: Joi.boolean(),
        tag_id: Joi.string(),
    });
};

