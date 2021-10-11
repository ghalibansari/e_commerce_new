import {BaseBusiness} from '../BaseBusiness'
import {AclRoleUrlRepository} from "./acl-role-url.repository";
import {IAclRoleUrl} from "./acl-role-url.types";


class AclRoleUrlBusiness extends BaseBusiness<IAclRoleUrl> {
    private _aclRoleUrlRepository: AclRoleUrlRepository;

    constructor() {
        super(new AclRoleUrlRepository())
        this._aclRoleUrlRepository = new AclRoleUrlRepository();
    }
}


Object.seal(AclRoleUrlBusiness);
export = AclRoleUrlBusiness;