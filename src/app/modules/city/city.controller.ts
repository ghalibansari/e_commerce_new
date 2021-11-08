import { Application } from "express";
import { AuthGuard, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { IMCity, ICity } from "./city.types";
import { CityRepository } from "./city.repository";
import { CityValidation } from "./city.validation";


export class CityController extends BaseController<ICity, IMCity> {
    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("city", new CityRepository(), ['city_id', 'name', 'is_active'], [['name', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(CityValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(CityValidation.addCity), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(CityValidation.addCityBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(CityValidation.findById), validateBody(CityValidation.editCity), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(CityValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
