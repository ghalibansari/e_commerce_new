import { Application, Request, Response } from "express";
import { Constant, Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateBody, validateQuery } from "../../helper";
import { BaseController } from "../BaseController";
import { OrderRepository } from "./order.repository";
import { IMOrder, IOrder } from "./order.type";
import { OrderValidation } from "./order.validation";

// @ts-expect-error
export class OrderController extends BaseController<IOrder, IMOrder, OrderRepository> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("order", new OrderRepository(), ['transaction_id', 'grand_total', 'shipping_charges', 'type'], [['created_at', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        // this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(OrderValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/place-order", validateBody(OrderValidation.placeOrder), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.placeOrder))
        this.router.post("/checkout", validateBody(OrderValidation.checkout), TryCatch.tryCatchGlobe(this.checkout))
        this.router.get("/list", validateQuery(OrderValidation.list), TryCatch.tryCatchGlobe(this.list))
        this.router.get("/:id", validateQuery(OrderValidation.findById), TryCatch.tryCatchGlobe(this.findById))
        this.router.get("/download-invoice", validateQuery(OrderValidation.downloadInvoice),  TryCatch.tryCatchGlobe(this.downloadInvoice))
        // this.router.post("/bulk", validateBody(OrderValidation.addOrderBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(OrderValidation.findById), validateBody(OrderValidation.editOrder), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(OrderValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }

    /**
     * order summary
     * @param req 
     * @param res 
     */
    checkout = async (req: Request, res: Response): Promise<void> => {
        const { user: { user_id }, body: { address_id, coupon_code } }: any = req;
        
        const data = await this.repo.orderCheckout({ user_id, coupon_code, address_id });

        res.locals = { data, message: Messages.FETCH_SUCCESSFUL, status: true }
        return await JsonResponse.jsonSuccess(req, res, "checkout");
    }

    /**
     * prepare order data
    */
    placeOrder = async (req: Request, res: Response): Promise<void> => {
        const {transaction, user: { user_id }, body: { address_id, coupon_code } }: any = req;
        
        const data = await this.repo.placeOrder({ user_id, coupon_code, address_id, transaction });

        res.locals = { data, message: Messages.ORDER_PLACED_SUCCESSFULLY, status: true }
        return await JsonResponse.jsonSuccess(req, res, "checkout");
    };

    list = async (req: Request, res: Response): Promise<void> => {
        let { pageSize, pageNumber }:any = req.query;
        const { user: { user_id } }: any = req;

        pageNumber ||= Constant.DEFAULT_PAGE_NUMBER;
        pageSize ||= Constant.DEFAULT_PAGE_SIZE;

        const {page, data} = await new OrderRepository().orderList({user_id, pageNumber, pageSize });

        res.locals = { status: true, page, data, message: Messages.FETCH_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, `list`);
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        const { params: { id } }: any = req
        const { user: { user_id } }: any = req;

        const data = await new OrderRepository().orderDetails({user_id, order_id: id });

        res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, `findById`);
    }

    downloadInvoice = async (req: Request, res: Response): Promise<void> => {
        const { order_id }:any = req.query;
        const { user: { user_id } }: any = req;

        await new OrderRepository().downloadInvoice({user_id, order_id, res });
    }
};