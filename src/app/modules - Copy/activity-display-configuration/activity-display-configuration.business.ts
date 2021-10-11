import {BaseBusiness} from '../BaseBusiness'
import {IActivityDisplayConfigurationTypes} from "./activity-display-configuration.types";
import {ActivityDisplayConfigurationRepository} from "./activity-display-configuration.repository";


class ActivityDisplayConfigurationBusiness extends BaseBusiness<IActivityDisplayConfigurationTypes> {
    private _activityDisplayConfigurationRepository: ActivityDisplayConfigurationRepository;

    constructor() {
        super(new ActivityDisplayConfigurationRepository())
        this._activityDisplayConfigurationRepository = new ActivityDisplayConfigurationRepository();
    }
}


Object.seal(ActivityDisplayConfigurationBusiness);
export = ActivityDisplayConfigurationBusiness;