
import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {Messages} from "../../constants"
import {BrandValidation} from "./brand.validation"
import {guard} from "../../helper/Auth";
import {IBrand} from "./brand.types";
//@ts-expect-error
import {BaseHelper} from "../BaseHelper";
import {BrandRepository} from "./brand.repository";
import { ErrorCodes } from "../../constants/ErrorCodes";


export class BrandController extends BaseController<IBrand> {
    constructor() {
        //url, brand0repo, attributes/columns, include/joints, sort, search-columns 
        super("brand", new BrandRepository(), ['brand_id', 'name', 'description', 'status'], [['created_on', 'DESC']], [], ['name'])
        this.init()
    }

    register = (express: Application) => express.use('/api/v1/brand', this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        // this.router.post("/", validation.createBrand, transaction.startTransaction, TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/", validation.updateBrand, transaction.startTransaction, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/:id", TryCatch.tryCatchGlobe(this.deleteByIdBC));
    }
}