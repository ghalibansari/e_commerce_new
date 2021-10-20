
import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {Messages} from "../../constants"
import {CategoryValidation} from "./category.validation"
import {guard} from "../../helper/Auth";
import {ICategory} from "./category.types";
//@ts-expect-error
import {BaseHelper} from "../BaseHelper";
import {CategoryRepository} from "./category.repository";
import { ErrorCodes } from "../../constants/ErrorCodes";


export class CategoryController extends BaseController<ICategory> {
    constructor() {
        //url, category0repo, attributes/columns, include/joints, sort, search-columns 
        super("category", new CategoryRepository(), ['category_id', 'name', 'description', 'status'], [['created_on', 'DESC']], [], ['name'])
        this.init()
    }

    register = (express: Application) => express.use('/api/v1/category', this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        // this.router.post("/", validation.createCategory, transaction.startTransaction, TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/", validation.updateCategory, transaction.startTransaction, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/:id", TryCatch.tryCatchGlobe(this.deleteByIdBC));
    }
}