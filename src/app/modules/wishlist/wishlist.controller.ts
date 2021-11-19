import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { WishlistRepository } from "./wishlist.repository";
import { IMWishlist, IWishlist } from "./wishlist.type";
import { WishlistValidation } from "./wishlist.validation";


export class WishlistController extends BaseController<IWishlist, IMWishlist> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("wishlist", new WishlistRepository(), ['wishlist_id', 'product_id', 'user_id'], [['wishlist_id', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.index));
        this.router.get("/:id", validateParams(WishlistValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        // this.router.post("/", validateBody(WishlistValidation.addWishlist), TryCatch.tryCatchGlobe(this.createOneBC))
        // this.router.post("/bulk", validateBody(WishlistValidation.addWishlistBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(WishlistValidation.findById), validateBody(WishlistValidation.editWishlist), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(WishlistValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))

        this.router.post("/add-to-wishlist", validateParams(WishlistValidation.findByProduct_id), TryCatch.tryCatchGlobe(this.addToWishlist))
        this.router.post("/move-to-cart", validateParams(WishlistValidation.findByProduct_id),DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.moveToCart))
        this.router.delete("/remove-from-wishlist", validateParams(WishlistValidation.findByProduct_id), TryCatch.tryCatchGlobe(this.removeFromWishlist))
        // this.router.get("/getWishlist",TryCatch.tryCatchGlobe(this.getWishlist))
    };

    index = async (req: Request, res: Response) => {
        const { user: { user_id } }: any = req;
        req.query.where = { user_id };
        await this.indexBC(req, res);
    }

    addToWishlist = async (req: Request, res: Response) => {
        const { query: { product_id }, user: { user_id } }: any = req;

        await new WishlistRepository().addToWishlist({ product_id, user_id })

        res.locals = { message: Messages.ADD_TO_WISHLIST };
        return await JsonResponse.jsonSuccess(req, res, `AddToWishlist`);
    }

    removeFromWishlist = async (req: Request, res: Response) => {
        const { query: { product_id }, user: { user_id } }: any = req;

        await new WishlistRepository().removeFromWishlist({ product_id, user_id })

        res.locals = { message: Messages.REMOVE_SUCCESSFULLY, status: true };
        return await JsonResponse.jsonSuccess(req, res, `removeFromWishlist`);
    }

    moveToCart = async (req: Request, res: Response) => {
        const { query: { product_id }, user: { user_id }, transaction }: any = req;

        await new WishlistRepository().moveToCart({ product_id, user_id, transaction })

        res.locals = { status: true, message: Messages.SUCCESS };
        return await JsonResponse.jsonSuccess(req, res, `moveToCart`);
    }
};
