import { BaseController } from "../BaseController"
import { Application } from "express"
import { TryCatch } from "../../helper"
import { guard } from "../../helper/Auth"
import DeviceCommandBusiness from "./device-command.business"
import { IDeviceCommand } from "./device-command.types"
import { DeviceCommandValidation } from "./device-command.validation"

export class DeviceCommandController extends BaseController<IDeviceCommand> {
    constructor() {
        super(new DeviceCommandBusiness(), "device-command", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/device-command', guard, this.router);
    }

    init() {
        const validation: DeviceCommandValidation = new DeviceCommandValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createDeviceCommand, TryCatch.tryCatchGlobe(this.createBC));
    }
}