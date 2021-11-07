import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IOrder } from "./order.type";

export abstract class OrderValidation extends BaseValidation {
    static readonly addOrder = Joi.object<IOrder>({
        order_id: Joi.string(),
        user_id: Joi.string(),
        transaction_id: Joi.string(),
        grand_total: Joi.number().required(),
        shipping_charges: Joi.number(),
        status: Joi.string().required(),
    });

    static readonly addOrderBulk = Joi.array().items(this.addOrder)

    static readonly editOrder = Joi.object<IOrder>({
        order_id: Joi.string(),
        user_id: Joi.string(),
        transaction_id: Joi.string(),
        grand_total: Joi.number(),
        shipping_charges: Joi.number(),
        status: Joi.string(),
    });
};