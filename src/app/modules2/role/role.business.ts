import {BaseBusiness} from '../BaseBusiness'
import {RoleRepository} from "./role.repository";
import {IRole} from "./role.types";


class RoleBusiness extends BaseBusiness<IRole> {
    private _roleRepository: RoleRepository;

    constructor() {
        super(new RoleRepository())
        this._roleRepository = new RoleRepository();
    }
}


Object.seal(RoleBusiness);
export = RoleBusiness;