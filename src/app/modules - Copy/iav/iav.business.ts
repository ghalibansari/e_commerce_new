import {BaseBusiness} from '../BaseBusiness'
import { IavRepository } from './iav.repository';
import { IIav } from './iav.types';


class IavBusiness extends BaseBusiness<IIav> {
    private _iavRepository: IavRepository;

    constructor() {
        super(new IavRepository())
        this._iavRepository = new IavRepository();
    }
}


Object.seal(IavBusiness);
export = IavBusiness;