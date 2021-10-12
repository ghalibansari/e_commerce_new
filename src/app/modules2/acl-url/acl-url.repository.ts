import {BaseRepository} from "../BaseRepository";
import aclUrlModel from "./acl-url.model";
import {IAclUrl} from "./acl-url.types";


export class AclUrlRepository extends BaseRepository<IAclUrl> {
    constructor () {
        super(aclUrlModel);
    }
}