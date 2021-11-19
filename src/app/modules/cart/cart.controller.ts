import { Messages } from "app/constants";
import { Application, Request, Response } from "express";
import { AuthGuard, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
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
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(cartValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(cartValidation.addCart), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(cartValidation.addCartBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(cartValidation.findById), validateBody(cartValidation.editCart), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(cartValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))


    };

    addToCart = async (req: Request, res: Response) => {
        const { user: { user_id }, query: { product_id, quantity } }: any = req
        if (quantity) await this.repo.createOneBR({ newData: { product_id, quantity, user_id }, created_by: user_id });
        res.locals = { message: Messages.SUCCESSFULLY_ADDED_TO_CART }
        return await JsonResponse.jsonSuccess(req, res, "addToCart");
    };




};
