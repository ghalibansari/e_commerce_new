import {BaseBusiness} from '../../../BaseBusiness'
import { ClarityRangeRepository } from './clarity-range.repository';
import { IClarityRange } from './clarity-range.types';


class ClarityRangeBusiness extends BaseBusiness<IClarityRange>{
    private _clarityRangeRepository: ClarityRangeRepository;

    constructor() {
        super(new ClarityRangeRepository())
        this._clarityRangeRepository = new ClarityRangeRepository();
    }
}


Object.seal(ClarityRangeBusiness);
export = ClarityRangeBusiness;