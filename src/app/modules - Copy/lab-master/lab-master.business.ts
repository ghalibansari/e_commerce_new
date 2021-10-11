import {BaseBusiness} from '../BaseBusiness'
import { LabMasterRepository } from './lab-master.repository';
import { ILabMaster } from './lab-master.types';


class LabMasterBusiness extends BaseBusiness<ILabMaster>{
    private _labMasterRepository: LabMasterRepository;

    constructor() {
        super(new LabMasterRepository())
        this._labMasterRepository = new LabMasterRepository();
    }
}


Object.seal(LabMasterBusiness);
export = LabMasterBusiness;