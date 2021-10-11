import {BaseController} from "../BaseController"
import {Application} from "express"
import {TryCatch} from "../../helper"
import {StatusValidation} from "./status.validation"
import {guard} from "../../helper/Auth"
import StatusBusiness from "./status.business"
import {IStatus} from "./status.types"

export class StatusController extends BaseController<IStatus> {
    constructor() {
        super(new StatusBusiness(), "status", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/status', guard, this.router);
    }

    init() {
        const validation: StatusValidation = new StatusValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createStatus, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateStatus, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}