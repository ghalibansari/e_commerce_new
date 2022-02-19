import { Application, Request, Response } from "express";
import { Op } from "sequelize";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { BaseValidation } from "../BaseValidation";
import { ProductRepository } from "../products/product.repository";
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
        this.router.delete("/remove-from-cart", validateParams(cartValidation.findByProduct_id), TryCatch.tryCatchGlobe(this.removeFromCart))
        this.router.post("/move-to-wishlist", validateParams(cartValidation.findByRemoveProduct_id), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.moveToWishList))

    }

    addToCart = async (req: Request, res: Response) => {
        const { query: { product_id, quantity }, user: { user_id } }: any = req;

        await new CartRepository().addToCart({ product_id, quantity, user_id })

        res.locals = { status: true, message: Messages.ADD_TO_CART };
        return await JsonResponse.jsonSuccess(req, res, `AddToCart`);
    };

    removeFromCart = async (req: Request, res: Response) => {
        const { query: { product_id }, user: { user_id } }: any = req;

        await new CartRepository().removeFromCart({ product_id, user_id })

        res.locals = { status: true, message: Messages.REMOVE_SUCCESSFULLY };
        return await JsonResponse.jsonSuccess(req, res, `removeFromCart`);
    };

    moveToWishList = async (req: Request, res: Response) => {
        const { query: { product_id }, user: { user_id }, transaction }: any = req;

        await new CartRepository().moveToWishList({ product_id, user_id, transaction })

        res.locals = { status: true, message: Messages.SUCCESS };
        return await JsonResponse.jsonSuccess(req, res, `moveToWishList`);
    };

    index = async (req: Request, res: Response): Promise<void> => {
        await BaseValidation.index.validateAsync(req.query);

        let { where, attributes, order, search, pageSize, pageNumber }: any = req.query;
        const { user: { user_id } }: any = req

        where ||= {}
        search ||= ''
        order ||= this.order
        attributes ||= this.attributes
        pageNumber ||= this.pageNumber
        pageSize ||= this.pageSize

        where['user_id'] = user_id

        //search
        if (search && search.length > 2 && this.searchColumn.length) {
            where[Op.or] = []
            for (const col of this.searchColumn) {
                where[Op.or].push({ [col]: { [Op.iLike]: `%${search}%` } })
            }
        }
        const ProductRepo = new ProductRepository()
        const include = [{ model: ProductRepo._model, as: "product", attributes: ['name', 'selling_price', 'product_id'] }];
        const { page, data } = await new CartRepository().index({ where, attributes, include, order, pageNumber, pageSize })
        res.locals = { status: true, page, data, message: Messages.FETCH_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.indexBC`)
    };
};
