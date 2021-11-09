import Joi, { required } from "joi";
import { BaseValidation } from "../BaseValidation";
import { ICart} from "./cart.types";

export abstract class cartValidation extends BaseValidation {
    static readonly addCart = Joi.object<ICart>({
        product_id: Joi.string().required(),
        user_id: Joi.string().required(),
        quantity: Joi.boolean().required(),
        });

    static readonly addCartBulk = Joi.array().items(this.addCart)
   
    static readonly editCart = Joi.object<ICart>({
        product_id: Joi.string(),
        user_id: Joi.number(),
        quantity: Joi.boolean()
    });
    
};