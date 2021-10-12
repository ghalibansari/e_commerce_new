import {BaseBusiness} from '../BaseBusiness'
import {AclUrlRepository} from "./acl-url.repository";
import {IAclUrl} from "./acl-url.types";


class AclUrlBusiness extends BaseBusiness<IAclUrl> {
    private _aclUrlRepository: AclUrlRepository;

    constructor() {
        super(new AclUrlRepository())
        this._aclUrlRepository = new AclUrlRepository();
    }
}


Object.seal(AclUrlBusiness);
export = AclUrlBusiness;