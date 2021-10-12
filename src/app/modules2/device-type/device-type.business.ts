import {BaseBusiness} from '../BaseBusiness'
import {DeviceTypeRepository} from "./device-type.repository"
import { IDeviceType } from './device-type.types';


class DeviceTypeBusiness extends BaseBusiness<IDeviceType> {
    private _deviceTypeRepository: DeviceTypeRepository;

    constructor() {
        super(new DeviceTypeRepository())
        this._deviceTypeRepository = new DeviceTypeRepository();
    }
}


Object.seal(DeviceTypeBusiness);
export = DeviceTypeBusiness;