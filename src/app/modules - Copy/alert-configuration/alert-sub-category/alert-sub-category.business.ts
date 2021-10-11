import {BaseBusiness} from '../../BaseBusiness'
import { AlertSubCategoryRepository } from './alert-sub-category.repository';
import { IAlertSubCategory } from './alert-sub-category.types';


class AlertSubCategoryBusiness extends BaseBusiness<IAlertSubCategory>{
    private _alertSubCategoryRepository: AlertSubCategoryRepository;

    constructor() {
        super(new AlertSubCategoryRepository())
        this._alertSubCategoryRepository = new AlertSubCategoryRepository();
    }
}


Object.seal(AlertSubCategoryBusiness);
export = AlertSubCategoryBusiness;