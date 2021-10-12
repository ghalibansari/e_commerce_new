import { BaseBusiness } from '../BaseBusiness'
import { DeviceCommandRepository } from "./device-command.repository"
import { IDeviceCommand } from "./device-command.types";


class DeviceCommandBusiness extends BaseBusiness<IDeviceCommand> {
    private _deviceCommandRepository: DeviceCommandRepository;

    constructor() {
        super(new DeviceCommandRepository())
        this._deviceCommandRepository = new DeviceCommandRepository();
    }
}


Object.seal(DeviceCommandBusiness);
export = DeviceCommandBusiness;