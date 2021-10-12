import {BaseBusiness} from '../../../BaseBusiness'
import { CaratMasterRepository } from './carat-master.repository';
import { ICaratMaster } from './carat-master.types';


class CaratMasterBusiness extends BaseBusiness<ICaratMaster>{
    private _caratMasterRepository: CaratMasterRepository;

    constructor() {
        super(new CaratMasterRepository())
        this._caratMasterRepository = new CaratMasterRepository();
    }
}


Object.seal(CaratMasterBusiness);
export = CaratMasterBusiness;