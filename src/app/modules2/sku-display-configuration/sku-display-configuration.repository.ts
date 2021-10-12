import {BaseRepository} from "../BaseRepository";
import {ISkuDisplayConfigurationTypes} from "./sku-display-configuration.types";
import skuDisplayConfigurationModel from "./sku-display-configuration.model";


export class SkuDisplayConfigurationRepository extends BaseRepository<ISkuDisplayConfigurationTypes> {
    constructor () {
        super(skuDisplayConfigurationModel);
    }
}