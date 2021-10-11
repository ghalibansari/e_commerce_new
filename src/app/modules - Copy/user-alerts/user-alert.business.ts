import {BaseBusiness} from '../BaseBusiness'
import { UserAlertRepository } from './user-alert.repository';
import { IUserAlerts } from './user-alert.types';


class UserAlertBusiness extends BaseBusiness<IUserAlerts>{
    private _userAlert: UserAlertRepository;

    constructor() {
        super(new UserAlertRepository())
        this._userAlert = new UserAlertRepository();
    }
}


Object.seal(UserAlertBusiness);
export = UserAlertBusiness;