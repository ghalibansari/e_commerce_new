import {BaseBusiness} from '../../BaseBusiness'
import { AlertTypeRepository } from './alert-type.repository';
import { IAlertType } from './alert-type.types';

class AlertTypeBusiness extends BaseBusiness<IAlertType>{
    private _alertTypeRepository: AlertTypeRepository;

    constructor() {
        super(new AlertTypeRepository())
        this._alertTypeRepository = new AlertTypeRepository();
    }
}

Object.seal(AlertTypeBusiness);
export = AlertTypeBusiness;