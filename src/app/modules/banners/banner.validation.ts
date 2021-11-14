import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IBanner } from './banner.types';


export abstract class BannerValidation extends BaseValidation {

    static readonly addBanner = Joi.object<IBanner>({
        banner_text: Joi.string().required(),
        order_sequence: Joi.number().required(),
        show_on_home_screen: Joi.boolean(),
        banner_image: Joi.string(),
    });

    static readonly editBanner = Joi.object<IBanner>({
        banner_text: Joi.string(),
        is_active: Joi.boolean(),
        order_sequence: Joi.number(),
        show_on_home_screen: Joi.boolean(),
        banner_image: Joi.string(),
    });
}

