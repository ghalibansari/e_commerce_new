import Joi, { required } from "joi";
import { BaseValidation } from "../BaseValidation";
import { ICategories } from "./categories.type";

export abstract class categoriesValidation extends BaseValidation {
    static readonly addCategorie = Joi.object<ICategories>({
        category_name: Joi.string().required(),
        parent_id: Joi.string().required(),
        order_sequence: Joi.number().required(),
        show_on_homeScreen: Joi.boolean().required(),
        category_image: Joi.string().required()
        });

    static readonly addCategorieBulk = Joi.array().items(this.addCategorie)

    static readonly editCategorie = Joi.object<ICategories>({
        category_name: Joi.string(),
        parent_id: Joi.string(),
        is_active: Joi.boolean(),
        order_sequence: Joi.number(),
        show_on_homeScreen: Joi.boolean(),
        category_image: Joi.string()
    });
};