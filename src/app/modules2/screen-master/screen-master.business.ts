import {BaseBusiness} from '../BaseBusiness'
import {ScreenMasterRepository} from "./screen-master.repository";
import {IScreenMasterTypes} from "./screen-master.types";


class ScreenMasterBusiness extends BaseBusiness<IScreenMasterTypes> {
    private _screenMasterRepository: ScreenMasterRepository;

    constructor() {
        super(new ScreenMasterRepository())
        this._screenMasterRepository = new ScreenMasterRepository();
    }
}


Object.seal(ScreenMasterBusiness);
export = ScreenMasterBusiness;