import {BaseRepository} from "../BaseRepository";
import aclUserUrlModel from "./acl-user-url.model";
import {IAclUserUrl} from "./acl-user-url.types";


export class AclUserUrlRepository extends BaseRepository<IAclUserUrl> {
    constructor () {
        super(aclUserUrlModel);
    }
}