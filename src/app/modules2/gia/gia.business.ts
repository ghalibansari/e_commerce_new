import {BaseBusiness} from '../BaseBusiness'
import {GiaRepository} from './gia.repository'
import {IGia} from "./gia.types";


class GiaBusiness extends BaseBusiness<IGia> {
    private _giaRepository: GiaRepository;

    constructor() {
        super(new GiaRepository())
        this._giaRepository = new GiaRepository();
    }
}


Object.seal(GiaBusiness);
export = GiaBusiness;