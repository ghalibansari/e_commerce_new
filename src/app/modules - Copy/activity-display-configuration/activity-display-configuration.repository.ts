import {BaseRepository} from "../BaseRepository";
import {IActivityDisplayConfigurationTypes} from "./activity-display-configuration.types";
import activityDisplayConfigurationModel from "./activity-display-configuration.model";


export class ActivityDisplayConfigurationRepository extends BaseRepository<IActivityDisplayConfigurationTypes> {
    constructor () {
        super(activityDisplayConfigurationModel);
    }
}