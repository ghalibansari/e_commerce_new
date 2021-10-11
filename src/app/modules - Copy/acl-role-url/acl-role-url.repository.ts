import {BaseRepository} from "../BaseRepository"
import aclRoleUrlModel from "./acl-role-url.model"
import {IAclRoleUrl} from "./acl-role-url.types"


export class AclRoleUrlRepository extends BaseRepository<IAclRoleUrl> {
    constructor () {
        super(aclRoleUrlModel)
    }
}