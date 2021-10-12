import {BaseBusiness} from "../BaseBusiness";
import {StatusRepository} from "./status.repository";
import {IStatus} from "./status.types";

class StatusBusiness extends BaseBusiness<IStatus> {
    private _statusRepository: StatusRepository;

    constructor() {
        super(new StatusRepository())
        this._statusRepository = new StatusRepository()
    }
}

Object.seal(StatusBusiness)
export = StatusBusiness