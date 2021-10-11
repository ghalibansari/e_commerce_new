import {BaseBusiness} from '../BaseBusiness'
import { LedSelectionRepository } from './led-selection.repository';
import { ILedSelection } from './ledSelection.types';


class LedSelectionBusiness extends BaseBusiness<ILedSelection>{
    private _ledSelectionRepository: LedSelectionRepository;

    constructor() {
        super(new LedSelectionRepository())
        this._ledSelectionRepository = new LedSelectionRepository();
    }
}


Object.seal(LedSelectionBusiness);
export = LedSelectionBusiness;