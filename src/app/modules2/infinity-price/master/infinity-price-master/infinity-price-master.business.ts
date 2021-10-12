import {BaseBusiness} from '../../../BaseBusiness'
import {InfinityPriceMasterRepository} from './infinity-price-master.repository';
import {IInfinityPriceMaster} from './infinity-price-master.types';


class InfinityPriceMasterBusiness extends BaseBusiness<IInfinityPriceMaster>{
    private _infinityPriceMasterRepository: InfinityPriceMasterRepository;

    constructor() {
        super(new InfinityPriceMasterRepository())
        this._infinityPriceMasterRepository = new InfinityPriceMasterRepository();
    }
}


Object.seal(InfinityPriceMasterBusiness);
export = InfinityPriceMasterBusiness;