import {BaseBusiness} from '../../../BaseBusiness'
import { FluorescenseMasterRepository } from './fluorescense-master.repository';
import { IFluorescenseMaster } from './fluorescense-master.types';


class FluorescenseMasterBusiness extends BaseBusiness<IFluorescenseMaster>{
    private _fluorescenseMasterRepository: FluorescenseMasterRepository;

    constructor() {
        super(new FluorescenseMasterRepository())
        this._fluorescenseMasterRepository = new FluorescenseMasterRepository();
    }
}

Object.seal(FluorescenseMasterBusiness);
export = FluorescenseMasterBusiness;
