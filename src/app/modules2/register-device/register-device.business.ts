import {BaseBusiness} from '../BaseBusiness'
import { RegisterDeviceRepository } from './register-device.repository';
import { IRegisterDevice } from './register-device.types';


class RegisterDeviceBusiness extends BaseBusiness<IRegisterDevice>{
    private _registerDeviceRepository: RegisterDeviceRepository;

    constructor() {
        super(new RegisterDeviceRepository())
        this._registerDeviceRepository = new RegisterDeviceRepository();
    }
}


Object.seal(RegisterDeviceBusiness);
export = RegisterDeviceBusiness;