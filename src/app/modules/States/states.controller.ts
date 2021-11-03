import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { StateRepository } from "./states.repository";
import { IStates, IMStates  } from "./states.type";
import { StatesValidation} from "./states.validation";


export class StateController extends BaseController<IStates, IMStates> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("state", new StateRepository(), ['state_id', 'name', 'is_active'], [['name', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(StatesValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(StatesValidation.addStates), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(StatesValidation.addStateBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(StatesValidation.findById), validateBody(StatesValidation.editState), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(StatesValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
