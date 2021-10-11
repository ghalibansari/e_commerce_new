import {BaseBusiness} from '../BaseBusiness'
import {ISkuInfinityPrice} from "./sku-infinity-price.types";
import {SkuInfinityPriceRepository} from "./sku-infinity-price.repository";


class SkuInfinityPriceBusiness extends BaseBusiness<ISkuInfinityPrice> {
    private _skuInfinityPriceRepository: SkuInfinityPriceRepository;

    constructor() {
        super(new SkuInfinityPriceRepository())
        this._skuInfinityPriceRepository = new SkuInfinityPriceRepository();
    }
}


Object.seal(SkuInfinityPriceBusiness);
export = SkuInfinityPriceBusiness;