import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IOrderProduct } from "./order-products.type";

export abstract class OrderProductValidation extends BaseValidation {
    static readonly addOrderProduct = Joi.object<IOrderProduct>({
        order_product_id: Joi.string(),
        order_id: Joi.string(),
        product_id: Joi.string(),
        quantity: Joi.number().required(),
        amount: Joi.number()
    });

    static readonly addOrderProductBulk = Joi.array().items(this.addOrderProduct)

    static readonly editOrderProduct = Joi.object<IOrderProduct>({
        order_product_id: Joi.string(),
        order_id: Joi.string(),
        product_id: Joi.string(),
        quantity: Joi.number(),
        amount: Joi.number()
    });
};