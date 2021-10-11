import {BaseRepository} from "../BaseRepository";
import {ICron} from "./cron.types";
import cronModel from "./cron.model";


export class CronRepository extends BaseRepository<ICron> {
    constructor () {
        super(cronModel);
    }
}