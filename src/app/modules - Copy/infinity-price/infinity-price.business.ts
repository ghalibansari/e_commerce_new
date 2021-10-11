import {BaseBusiness} from '../BaseBusiness'
import { InfinityPriceRepository } from './infinity-price.repository';
import {IInfinityPrice} from "./infinity-price.types";


class InfinityPriceBusiness extends BaseBusiness<IInfinityPrice>{
    private _infinityPriceRepository: InfinityPriceRepository;

    constructor() {
        super(new InfinityPriceRepository())
        this._infinityPriceRepository = new InfinityPriceRepository();
    }
}


Object.seal(InfinityPriceBusiness);
export = InfinityPriceBusiness;