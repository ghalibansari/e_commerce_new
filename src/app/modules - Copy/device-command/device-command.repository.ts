import { BaseRepository } from "../BaseRepository";
import deviceCommandModel from "./device-command.model";
import { IDeviceCommand } from "./device-command.types";


export class DeviceCommandRepository extends BaseRepository<IDeviceCommand> {
    constructor() {
        super(deviceCommandModel);
    }
}