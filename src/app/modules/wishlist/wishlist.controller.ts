import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { WishlistRepository } from "./wishlist.repository";
import { IWishlist, IMWishlist} from "./wishlist.type";
import { WishlistValidation } from "./wishlist.validation";


export class WishlistController extends BaseController<IWishlist, IMWishlist> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("wishlist", new WishlistRepository(), ['wishlist_id', 'product_id', 'user_id', 'quantity'], [['wishlist_id', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(WishlistValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(WishlistValidation.addWishlist), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(WishlistValidation.addWishlistBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(WishlistValidation.findById), validateBody(WishlistValidation.editWishlist), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(WishlistValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
