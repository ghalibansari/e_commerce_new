import {BaseBusiness} from '../BaseBusiness'
import {IDisplayConfiguration} from "./diaplay-configuration.types";
import {DisplayConfigurationRepository} from "./display-configuration.repository";


class DisplayConfigurationBusiness extends BaseBusiness<IDisplayConfiguration> {
    private _userRepository: DisplayConfigurationRepository;

    constructor() {
        super(new DisplayConfigurationRepository())
        this._userRepository = new DisplayConfigurationRepository();
    }
}


Object.seal(DisplayConfigurationBusiness);
export = DisplayConfigurationBusiness;