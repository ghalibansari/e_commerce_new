import {BaseBusiness} from '../BaseBusiness'
import {ICron} from "./cron.types";
import {CronRepository} from "./cron.repository";


class CronBusiness extends BaseBusiness<ICron> {
    private _cronRepository: CronRepository;

    constructor() {
        super(new CronRepository())
        this._cronRepository = new CronRepository();
    }
}


Object.seal(CronBusiness);
export = CronBusiness;