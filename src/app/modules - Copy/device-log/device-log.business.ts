import { BaseBusiness } from '../BaseBusiness'
import { DeviceLogRepository } from "./device-log.repository"
import { IDeviceLog } from "./device-log.types";


class DeviceLogBusiness extends BaseBusiness<IDeviceLog> {
    private _deviceLogRepository: DeviceLogRepository;

    constructor() {
        super(new DeviceLogRepository())
        this._deviceLogRepository = new DeviceLogRepository();
    }
}


Object.seal(DeviceLogBusiness);
export = DeviceLogBusiness;