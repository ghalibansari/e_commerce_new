import { BaseController } from "../BaseController"
import { Application } from "express"
import { TryCatch } from "../../helper"
import { guard } from "../../helper/Auth"
import DeviceLogBusiness from "./device-log.business"
import { IDeviceLog } from "./device-log.types"
import { DeviceLogValidation } from "./device-log.validation"

export class DeviceLogController extends BaseController<IDeviceLog> {
    constructor() {
        super(new DeviceLogBusiness(), "device-log", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/device-log', guard, this.router);
    }

    init() {
        const validation: DeviceLogValidation = new DeviceLogValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createDeviceLog, TryCatch.tryCatchGlobe(this.createBC));
    }
}