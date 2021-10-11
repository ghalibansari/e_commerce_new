import { BaseRepository } from "../BaseRepository";
import deviceLogModel from "./device-log.model";
import { IDeviceLog } from "./device-log.types";


export class DeviceLogRepository extends BaseRepository<IDeviceLog> {
    constructor() {
        super(deviceLogModel);
    }
}