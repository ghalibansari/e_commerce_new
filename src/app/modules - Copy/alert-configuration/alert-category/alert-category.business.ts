import {BaseBusiness} from '../../BaseBusiness'
import { AlertCategoryRepository } from './alert-category.repository';
import { IAlertCategory } from './alert-category.types';


class AlertCategoryBusiness extends BaseBusiness<IAlertCategory>{
    private _alertCategoryRepository: AlertCategoryRepository;

    constructor() {
        super(new AlertCategoryRepository())
        this._alertCategoryRepository = new AlertCategoryRepository();
    }
}


Object.seal(AlertCategoryBusiness);
export = AlertCategoryBusiness;