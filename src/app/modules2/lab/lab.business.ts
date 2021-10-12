import {BaseBusiness} from '../BaseBusiness'
import {LabRepository} from "./lab.repository";
import {ILab} from "./lab.types";


class LabBusiness extends BaseBusiness<ILab>{
    private _labRepository: LabRepository;

    constructor() {
        super(new LabRepository())
        this._labRepository = new LabRepository();
    }
}


Object.seal(LabBusiness);
export = LabBusiness;