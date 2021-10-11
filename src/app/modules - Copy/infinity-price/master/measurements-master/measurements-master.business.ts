import {BaseBusiness} from '../../../BaseBusiness'
import { MeasurementsMasterRepository } from './measurements-master.repository';
import { IMeasurementsMaster } from './measurements-master.types';

class MeasurementsMasterBusiness extends BaseBusiness<IMeasurementsMaster>{
    private _measurementsMasterRepository: MeasurementsMasterRepository;

    constructor() {
        super(new MeasurementsMasterRepository())
        this._measurementsMasterRepository = new MeasurementsMasterRepository();
    }
}


Object.seal(MeasurementsMasterBusiness);
export = MeasurementsMasterBusiness;