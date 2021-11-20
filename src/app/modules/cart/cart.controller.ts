import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { CartRepository } from "./cart.repository";
import { ICart, IMCart } from "./cart.types";
import { cartValidation } from "./cart.validation";


export class CartController extends BaseController<ICart, IMCart> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("cart", new CartRepository(), ['cart_id', 'product_id', 'user_id', 'quantity'], [['cart_id', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.index));
        // this.router.get("/:id", validateParams(cartValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        // this.router.post("/", validateBody(cartValidation.addCart), TryCatch.tryCatchGlobe(this.createOneBC))
        // this.router.post("/bulk", validateBody(cartValidation.addCartBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(cartValidation.findById), validateBody(cartValidation.editCart), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(cartValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))

        this.router.post("/add-to-cart", validateParams(cartValidation.findByProduct_id), TryCatch.tryCatchGlobe(this.addToCart))
        this.router.post("/add-to-cart", validateParams(cartValidation.findByProduct_id), TryCatch.tryCatchGlobe(this.addToCart))
        this.router.post("/move-to-wishList", validateParams(cartValidation.findByRemoveProduct_id), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.moveToWishList))

    }

    index = async (req: Request, res: Response) => {
        const { user: { user_id } }: any = req;
        req.query.where = { user_id };
        await this.indexBC(req, res);
    }

    addToCart = async (req: Request, res: Response) => {
        const { query: { product_id, quantity }, user: { user_id } }: any = req;

        await new CartRepository().addToCart({ product_id, quantity, user_id })

        res.locals = { status: true, message: Messages.ADD_TO_CART };
        return await JsonResponse.jsonSuccess(req, res, `AddToCart`);
    }

    removeFromCart = async (req: Request, res: Response) => {
        const { query: { product_id }, user: { user_id } }: any = req;

        await new CartRepository().removeFromCart({ product_id, user_id })

        res.locals = { status: true, message: Messages.REMOVE_SUCCESSFULLY };
        return await JsonResponse.jsonSuccess(req, res, `removeFromCart`);
    }

    moveToWishList = async (req: Request, res: Response) => {
        const { query: { product_id }, user: { user_id }, transaction }: any = req;

        await new CartRepository().moveToWishList({ product_id, user_id, transaction })

        res.locals = { status: true, message: Messages.SUCCESS };
        return await JsonResponse.jsonSuccess(req, res, `moveToWishList`);
    }
};
