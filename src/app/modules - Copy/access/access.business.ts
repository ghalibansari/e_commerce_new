import {BaseBusiness} from '../BaseBusiness'
import { AccessRepository } from './access.repository';
import { IAccess } from './access.types';


class AccessBusiness extends BaseBusiness<IAccess> {
    private _accessRepository: AccessRepository

    constructor() {
        super(new AccessRepository())
        this._accessRepository = new AccessRepository()
    }
}


Object.seal(AccessBusiness)
export = AccessBusiness