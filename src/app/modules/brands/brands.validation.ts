import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IBrands } from './brands.types';


export class BrandsValidation extends BaseValidation {
    static readonly addBrands = Joi.object<IBrands>({
        brand_name: Joi.string().required(),
        order_sequence: Joi.number(),
        show_on_homescreen: Joi.boolean(),
        banner_image: Joi.string(),
    });

    static readonly editBrands = Joi.object<IBrands>({
        brand_name: Joi.string(),
        is_active: Joi.boolean(),
        order_sequence: Joi.number(),
        show_on_homescreen: Joi.boolean(),
        banner_image: Joi.string(),
    });
}

