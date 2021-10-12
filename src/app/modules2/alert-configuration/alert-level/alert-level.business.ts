import {BaseBusiness} from '../../BaseBusiness'
import { AlertLevelRepository } from './alert-level.repository';
import { IAlertLevel } from './alert-level.types';

class AlertLevelBusiness extends BaseBusiness<IAlertLevel>{
    private _alertLevelRepository: AlertLevelRepository;

    constructor() {
        super(new AlertLevelRepository())
        this._alertLevelRepository = new AlertLevelRepository();
    }
}

Object.seal(AlertLevelBusiness);
export = AlertLevelBusiness;