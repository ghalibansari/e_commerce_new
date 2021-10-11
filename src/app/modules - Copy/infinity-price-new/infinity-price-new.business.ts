import {BaseBusiness} from '../BaseBusiness'
import { InfinityPriceRepositoryNew } from './infinity-price-new.repository';
import {IInfinityPriceNew} from "./infinity-price-new.types";


class InfinityPriceNewBusiness extends BaseBusiness<IInfinityPriceNew>{
    private _infinityPriceRepository: InfinityPriceRepositoryNew;

    constructor() {
        super(new InfinityPriceRepositoryNew())
        this._infinityPriceRepository = new InfinityPriceRepositoryNew();
    }
}


Object.seal(InfinityPriceNewBusiness);
export = InfinityPriceNewBusiness;