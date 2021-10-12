import {BaseBusiness} from '../BaseBusiness'
import {AclUserUrlRepository} from "./acl-user-url.repository"
import {IAclUserUrl} from "./acl-user-url.types";


class AclUserUrlBusiness extends BaseBusiness<IAclUserUrl> {
    private _aclUserUrlRepository: AclUserUrlRepository;

    constructor() {
        super(new AclUserUrlRepository())
        this._aclUserUrlRepository = new AclUserUrlRepository();
    }
}


Object.seal(AclUserUrlBusiness);
export = AclUserUrlBusiness;