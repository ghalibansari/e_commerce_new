import {BaseRepository} from "../../../BaseRepository";
import measurementsMasterModel from "./measurements-master.model";
import { IMeasurementsMaster } from "./measurements-master.types";

export class MeasurementsMasterRepository extends BaseRepository<IMeasurementsMaster> {
    constructor () {
        super(measurementsMasterModel);
    }
}