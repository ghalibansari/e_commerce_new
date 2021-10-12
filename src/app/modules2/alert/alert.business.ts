import {BaseBusiness} from '../BaseBusiness'
import {AlertRepository} from "./alert.repository";
import { IAlert } from './alert.types';


class AlertBusiness extends BaseBusiness<any> {
    private _alertRepository: AlertRepository;

    constructor() {
        super(new AlertRepository())
        this._alertRepository = new AlertRepository();
    }
}


Object.seal(AlertBusiness);
export = AlertBusiness;