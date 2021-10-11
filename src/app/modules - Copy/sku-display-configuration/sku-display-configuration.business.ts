import {BaseBusiness} from '../BaseBusiness'
import {SkuDisplayConfigurationRepository} from "./sku-display-configuration.repository";
import {ISkuDisplayConfigurationTypes} from "./sku-display-configuration.types";


class SkuDisplayConfigurationBusiness extends BaseBusiness<ISkuDisplayConfigurationTypes> {
    private _skuDisplayConfigurationRepository: SkuDisplayConfigurationRepository;

    constructor() {
        super(new SkuDisplayConfigurationRepository())
        this._skuDisplayConfigurationRepository = new SkuDisplayConfigurationRepository();
    }
}


Object.seal(SkuDisplayConfigurationBusiness);
export = SkuDisplayConfigurationBusiness;