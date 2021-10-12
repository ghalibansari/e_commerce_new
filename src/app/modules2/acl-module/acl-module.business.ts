import {BaseBusiness} from '../BaseBusiness'
import {AclModuleRepository} from "./acl-module.repository"
import {IAclModule} from "./acl-module.types";


class AclModuleBusiness extends BaseBusiness<IAclModule> {
    private _aclModuleRepository: AclModuleRepository

    constructor() {
        super(new AclModuleRepository())
        this._aclModuleRepository = new AclModuleRepository()
    }
}


Object.seal(AclModuleBusiness)
export = AclModuleBusiness