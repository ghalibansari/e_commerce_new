import {BaseBusiness} from '../BaseBusiness'
import {ISetting} from "./setting.types";
import {SettingRepository} from "./setting.repository";


class SettingBusiness extends BaseBusiness<ISetting> {
    private _userRepository: SettingRepository;

    constructor() {
        super(new SettingRepository())
        this._userRepository = new SettingRepository();
    }
}


Object.seal(SettingBusiness);
export = SettingBusiness;