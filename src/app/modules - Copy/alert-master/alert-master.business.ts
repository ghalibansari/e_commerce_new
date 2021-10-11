import {BaseBusiness} from '../BaseBusiness'
import {AlertMasterRepository} from "./alert-master.repository";
import {IAlertMaster} from "./alert-master.types";


class AlertMasterBusiness extends BaseBusiness<IAlertMaster>{
    private _alertMasterRepository: AlertMasterRepository;

    constructor() {
        super(new AlertMasterRepository())
        this._alertMasterRepository = new AlertMasterRepository();
    }
}


Object.seal(AlertMasterBusiness);
export = AlertMasterBusiness;