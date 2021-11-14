import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { ICategories } from "./categories.type";

export abstract class categoriesValidation extends BaseValidation {
    static readonly addCategory = Joi.object<ICategories>({
        category_name: Joi.string().required(),
        parent_id: Joi.string(),
        order_sequence: Joi.number().required(),
        show_on_home_screen: Joi.boolean().required(),
        category_image: Joi.string().required(),
        tag_id: Joi.string(),
        show_on_header: Joi.boolean().required()
    });

    static readonly addCategoriesBulk = Joi.array().items(this.addCategory)

    static readonly editCategory = Joi.object<ICategories>({
        category_name: Joi.string(),
        parent_id: Joi.string(),
        is_active: Joi.boolean(),
        order_sequence: Joi.number(),
        show_on_home_screen: Joi.boolean(),
        category_image: Joi.string(),
        tag_id: Joi.string(),
        show_on_header: Joi.boolean()
    });
};