import Joi, { required } from "joi";
import { BaseValidation } from "../BaseValidation";
import { IWishlist} from "./wishlist.type";

export abstract class WishlistValidation extends BaseValidation {
    static readonly addWishlist = Joi.object<IWishlist>({
        wishlist_id: Joi.string().required(),
        product_id: Joi.string().required(),
        user_id: Joi.number().required(),
        quantity: Joi.boolean().required()
        });

    static readonly addWishlistBulk = Joi.array().items(this.addWishlist)
   
    static readonly editWishlist = Joi.object<IWishlist>({
        wishlist_id: Joi.string(),
        product_id: Joi.string(),
        user_id: Joi.number(),
        quantity: Joi.boolean()
    });
}; 