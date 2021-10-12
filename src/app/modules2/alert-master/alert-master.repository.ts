import {BaseRepository} from "../BaseRepository";
import alertMasterModel from "./alert-master.model";
import {IAlertMaster} from "./alert-master.types"

//Todo interface
export class AlertMasterRepository extends BaseRepository<IAlertMaster> {
    constructor () {
        super(alertMasterModel);
    }
}