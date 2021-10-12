import {BaseBusiness} from '../BaseBusiness'
import {TransitRepository} from "./transit.repository";
import {ITransit} from "./transit.types";


class TransitBusiness extends BaseBusiness<ITransit> {
    private _transitRepository: TransitRepository;

    constructor() {
        super(new TransitRepository())
        this._transitRepository = new TransitRepository();
    }
}


Object.seal(TransitBusiness);
export = TransitBusiness;