import {BaseBusiness} from '../BaseBusiness'
import { IBusiness } from './business.types';
import { BusinessRepository } from './business.repository';


class BusinessBusiness extends BaseBusiness<IBusiness> {
    private _businessRepository: BusinessRepository;

    constructor() {
        super(new BusinessRepository())
        this._businessRepository = new BusinessRepository();
    }
}


Object.seal(BusinessBusiness);
export = BusinessBusiness;