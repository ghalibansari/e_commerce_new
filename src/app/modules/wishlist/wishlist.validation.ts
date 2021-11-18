import Joi from "joi";
import { BaseValidation, idValidate } from "../BaseValidation";
import { IWishlist } from "./wishlist.type";

export abstract class WishlistValidation extends BaseValidation {
    static readonly addWishlist = Joi.object<IWishlist>({
        wishlist_id: Joi.string().required(),
        product_id: Joi.string().required(),
        user_id: Joi.number().required(),
        });

    static readonly addWishlistBulk = Joi.array().items(this.addWishlist)
   
    static readonly editWishlist = Joi.object<IWishlist>({
        wishlist_id: Joi.string(),
        product_id: Joi.string(),
        user_id: Joi.number()
    });

    static readonly findByProduct_id = Joi.object({
        product_id: Joi.string().custom(idValidate)
    });
}