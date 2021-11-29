import { Application } from "express";
import { AuthGuard, TryCatch, validateBody } from "../../helper";
import { BaseController } from "../BaseController";
import { TagRepository } from "./tags.repository";
import { IMTag, ITag } from "./tags.types";
import { TagValidation } from "./tags.validation";

export class TagController extends BaseController<ITag, IMTag> {
    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("tag", new TagRepository(), ['tag_id', 'name', 'is_active'], [['name', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(TagValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(TagValidation.addTag), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(TagValidation.addTagBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(TagValidation.findById), validateBody(TagValidation.editTag), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(TagValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
