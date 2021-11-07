import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IProduct } from "./product.type";

export abstract class ProductValidation extends BaseValidation {
    static readonly addProduct = Joi.object<IProduct>({
        product_id: Joi.string(),
        category_id: Joi.string(),
        brand_id: Joi.string(),
        name: Joi.string().required(),
        description: Joi.string(),
        weight: Joi.number().required(),
        amount: Joi.number().required(),
    });

    static readonly addProductBulk = Joi.array().items(this.addProduct)

    static readonly editProduct = Joi.object<IProduct>({
        product_id: Joi.string(),
        category_id: Joi.string(),
        brand_id: Joi.string(),
        name: Joi.string(),
        description: Joi.string(),
        weight: Joi.number(),
        amount: Joi.number(),
    });
};