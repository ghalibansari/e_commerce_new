import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import RapPriceBusiness from "./rap-price.business";
import {IRapPrice} from "./rap-price.types";
import {RapPriceValidationValidation} from "./rap-price.validation";
import {RapPriceRepository} from "./rap-price.repository";
import {Messages} from "../../constants";


export class RapPriceController extends BaseController<IRapPrice> {
    constructor() {
        super(new RapPriceBusiness(), "rap-price");
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/rap-price', guard, this.router);
    }

    init() {
        const validation: RapPriceValidationValidation = new RapPriceValidationValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.post("/", validation.createUser, TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", validation.updateUser, TryCatch.tryCatchGlobe(this.updateBC));
        // this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.post("/get-prices", validation.getPrices, TryCatch.tryCatchGlobe(this.getPrices));//Todo fix validation

        this.router.get("/fetch", TryCatch.tryCatchGlobe(this.fetch));
        this.router.get("/filter-criteria", /*validation.filterCriteria,*/ TryCatch.tryCatchGlobe(this.filterCriteria));
    }

    async fetch(req: Request, res: Response) {
        let {body:{loggedInUser:{_id:loggedInUserId}}, query:{shape}} = req
        //@ts-expect-error
        res.locals.data = await new RapPriceBusiness().fetch(shape, loggedInUserId)
        res.locals.message = "Rap Price Fetch Successful";
        await JsonResponse.jsonSuccess(req, res, "email");
    }

    async filterCriteria(req: Request, res: Response) {
        let {body:{loggedInUser:{_id:loggedInUserId}}, query:{column}} = req
        //@ts-expect-error
        column = column?.replace(/'/g, '"')
        column = JSON.parse(column as any)
        res.locals.data = await new RapPriceRepository().filterCriteria(column as string[])
        res.locals.message = Messages.FETCH_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, "email");
    }

    async getPrices(req: Request, res: Response) {
        const RapPriceBusinessInstance = new RapPriceBusiness()
        const {body} = req
        let rapPriceQuery: any[] = []
        let rapPriceData: any[] = []
        rapPriceQuery = body.map(async({carat_weight, color, shape, clarity, reportNumber}:any) => {
            if(carat_weight > 5) carat_weight = 5.00;
            if (shape !== 'Round') shape = 'Pear';
            await RapPriceBusinessInstance.aggregateBB([
                {'$match': {'weightRange.fromWeight': {'$lte': carat_weight}, 'weightRange.toWeight': {'$gte': carat_weight}, shape, clarity, color}},
                {'$sort': {'_id': -1}}, {'$limit': 1}])
            .then(data => rapPriceData.push({reportNumber, _id: data[0]?._id || null, price: data[0]?.price || 0}))
        })
        await Promise.all(rapPriceQuery)
        res.locals.data = rapPriceData;
        res.locals.message = "Rap Price Fetch Successful";
        await JsonResponse.jsonSuccess(req, res, "email");
    }
}