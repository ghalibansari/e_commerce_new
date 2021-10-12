import {BaseRepository} from "../BaseRepository";
import aclModuleModel from "./acl-module.model";
import {IAclModule} from "./acl-module.types";


export class AclModuleRepository extends BaseRepository<IAclModule> {
    constructor () {
        super(aclModuleModel);
    }
}