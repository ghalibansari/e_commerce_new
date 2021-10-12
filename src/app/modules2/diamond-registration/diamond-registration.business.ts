import {BaseBusiness} from '../BaseBusiness'
import { DiamondRegistrationRepository } from './diamond-registration.repository';
import { IDiamondRegistration } from './diamond-registration.types';


class DiamondRegistrationBusiness extends BaseBusiness<IDiamondRegistration> {
    private _diamondRegistrationRepository: DiamondRegistrationRepository;

    constructor() {
        super(new DiamondRegistrationRepository())
        this._diamondRegistrationRepository = new DiamondRegistrationRepository();
    }
}


Object.seal(DiamondRegistrationBusiness);
export = DiamondRegistrationBusiness;