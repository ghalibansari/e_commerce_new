import Joi from "joi";
import { BaseValidation, idValidate } from "../BaseValidation";
import { ICart } from "./cart.types";

export abstract class cartValidation extends BaseValidation {
    static readonly addCart = Joi.object<ICart>({
        product_id: Joi.string().required(),
        user_id: Joi.string().required(),
        quantity: Joi.number().min(1).max(10)
     });

    static readonly addCartBulk = Joi.array().items(this.addCart)
   
    static readonly editCart = Joi.object<ICart>({
        product_id: Joi.string(),
        user_id: Joi.number(),
        quantity: Joi.boolean()
    });

    static readonly findByProduct_id = Joi.object({
        product_id: Joi.string().custom(idValidate),
    });

    static readonly findByRemoveProduct_id = Joi.object({
        product_id: Joi.string().custom(idValidate),
        quantity:Joi.number()
    });

    
};