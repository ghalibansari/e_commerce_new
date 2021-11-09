import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { UserValidation } from "../user/user.validation";
import { UserAddressRepository } from "./user-address.repository";
import {  IUserAddress, IMUserAddress  } from "./user-address.type";
import { UserAddressValidation } from "./user-address.vallidation";


export class UserAddressController extends BaseController<IUserAddress, IMUserAddress> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("user-address", new UserAddressRepository(), [''], [['address_id', 'DESC']], [],)
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(UserAddressValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(UserAddressValidation.addUserAddress), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(UserAddressValidation.addUserAddressBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(UserAddressValidation.findById), validateBody(UserAddressValidation.editUserAddress), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(UserAddressValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};
