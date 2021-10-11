import {BaseRepository} from "../BaseRepository";
import {IAcl} from "./acl.types";
import aclModel from "./acl.model";


//@ts-expect-error
export class AclRepository extends BaseRepository<IAcl> {
    constructor () {
        super(aclModel);
    }
}