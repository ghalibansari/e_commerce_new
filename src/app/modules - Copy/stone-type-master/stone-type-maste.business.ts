import {BaseBusiness} from '../BaseBusiness'
import { StoneTypeMasterRepository } from './stone-type-master.repository';
import { IStoneTypeMaster } from './stone-type-master.types';


class StoneTypeMasterBusiness extends BaseBusiness<IStoneTypeMaster>{
    private _stoneTypeMasterRepository: StoneTypeMasterRepository;

    constructor() {
        super(new StoneTypeMasterRepository())
        this._stoneTypeMasterRepository = new StoneTypeMasterRepository();
    }
}


Object.seal(StoneTypeMasterBusiness);
export = StoneTypeMasterBusiness;