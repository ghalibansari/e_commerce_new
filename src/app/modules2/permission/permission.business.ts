import {BaseBusiness} from '../BaseBusiness'
import {PermissionRepository} from "./permission.repository";
import {IPermission} from "./permission.types";


class PermissionBusiness extends BaseBusiness<IPermission>{
    private _permissionRepository: PermissionRepository;

    constructor() {
        super(new PermissionRepository())
        this._permissionRepository = new PermissionRepository();
    }
}


Object.seal(PermissionBusiness);
export = PermissionBusiness;