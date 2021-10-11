import {BaseController} from "../BaseController";
import {Application} from "express";
import {TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import AddressBusiness from "./address.business";
import {IAddress} from "./address.types";
import {AddressValidation} from "./address.validation";


export class AddressController extends BaseController<IAddress> {
    constructor() {
        super(new AddressBusiness(), "address", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/address', guard, this.router);
    }

    init() {
        const validation: AddressValidation = new AddressValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createAddress, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateAddress, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}