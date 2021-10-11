import {BaseBusiness} from '../BaseBusiness'
import { AlertConfigurationRepository } from './alert-configuration.repository';
import { IAlertConfiguration } from './alert-configuration.types';


class AlertConfigurationBusiness extends BaseBusiness<IAlertConfiguration>{
    private _alertConfigurationRepository: AlertConfigurationRepository;

    constructor() {
        super(new AlertConfigurationRepository())
        this._alertConfigurationRepository = new AlertConfigurationRepository();
    }
}


Object.seal(AlertConfigurationBusiness);
export = AlertConfigurationBusiness;