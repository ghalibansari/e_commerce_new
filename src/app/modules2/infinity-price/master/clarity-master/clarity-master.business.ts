import {BaseBusiness} from '../../../BaseBusiness'
import { ClarityMasterRepository } from './clarity-master.repository';
import { IClarityMaster } from './clarity-master.types';


class ClarityMasterBusiness extends BaseBusiness<IClarityMaster>{
    private _clarityMasterRepository: ClarityMasterRepository;

    constructor() {
        super(new ClarityMasterRepository())
        this._clarityMasterRepository = new ClarityMasterRepository();
    }
}


Object.seal(ClarityMasterBusiness);
export = ClarityMasterBusiness;