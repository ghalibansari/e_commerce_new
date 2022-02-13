import { Application } from "express";
import { AuthGuard } from "../../helper";
import { BaseController } from "../BaseController";
import { ProductImagesRepository } from "./product-images.repository";
import { IImage, IMImage } from "./product-images.type";


export class ProductImagesController extends BaseController<IImage, IMImage> {
    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("product-images", new ProductImagesRepository(), ['image_id', 'product_id', 'image_URL'], [['image_id', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        // this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(ImageValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        // this.router.post("/", validateBody(ImageValidation.addImage), TryCatch.tryCatchGlobe(this.createOneBC))
        // this.router.post("/bulk", validateBody(ImageValidation.addImageBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(ImageValidation.findById), validateBody(ImageValidation.editImage), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(ImageValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
