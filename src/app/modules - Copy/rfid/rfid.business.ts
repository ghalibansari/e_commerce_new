import {BaseBusiness} from '../BaseBusiness'
import {IRfid} from "./rfid.types";
import {RfidRepository} from "./rfid.repository";


class RfidBusiness extends BaseBusiness<IRfid>{
    private _rfidRepository: RfidRepository;

    constructor() {
        super(new RfidRepository())
        this._rfidRepository = new RfidRepository();
    }
}


Object.seal(RfidBusiness);
export = RfidBusiness;