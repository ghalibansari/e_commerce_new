
import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {Messages} from "../../constants"
import {UnitValidation} from "./unit.validation"
import {guard} from "../../helper/Auth";
import {IUnit} from "./unit.types";
//@ts-expect-error
import {BaseHelper} from "../BaseHelper";
import {UnitRepository} from "./unit.repository";
import { ErrorCodes } from "../../constants/ErrorCodes";


export class UnitController extends BaseController<IUnit> {
    constructor() {
        //url, unit0repo, attributes/columns, include/joints, sort, search-columns 
        super("unit", new UnitRepository(), ['unit_id', 'name', 'short_name', 'description', 'status'], [['created_on', 'DESC']], [], ['name'])
        this.init()
    }

    register = (express: Application) => express.use('/api/v1/unit', this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        // this.router.post("/", validation.createUnit, transaction.startTransaction, TryCatch.tryCatchGlobe(this.create));
        // this.router.put("/", validation.updateUnit, transaction.startTransaction, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/:id", TryCatch.tryCatchGlobe(this.deleteByIdBC));
    }
}