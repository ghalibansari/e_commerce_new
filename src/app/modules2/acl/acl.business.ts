import {BaseBusiness} from '../BaseBusiness'
import {AclRepository} from "./acl.repository"
import {IAcl} from "./acl.types";


class AclBusiness extends BaseBusiness<IAcl> {
    private _aclRepository: AclRepository

    constructor() {
        super(new AclRepository())
        this._aclRepository = new AclRepository()
    }
}


Object.seal(AclBusiness)
export = AclBusiness