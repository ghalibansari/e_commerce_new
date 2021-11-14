import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { CategoriesRepository } from "./categories.repository";
import { ICategories, IMCategories } from "./categories.type";
import { categoriesValidation } from "./categories.validation";


export class CategoryController extends BaseController<ICategories, IMCategories> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("category", new CategoriesRepository(), ['category_id', 'category_name', 'is_active', 'order_sequence', 'show_on_homeScreen', 'category_image'], [['category_name', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(categoriesValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(categoriesValidation.addCategory), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(categoriesValidation.addCategoriesBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(categoriesValidation.findById), validateBody(categoriesValidation.editCategory), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(categoriesValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
