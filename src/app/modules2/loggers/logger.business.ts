import {BaseBusiness} from '../BaseBusiness'
import {LoggerRepository} from "./logger.repository";
import {ILogger} from "./logger.types";


class LoggerBusiness extends BaseBusiness<ILogger>{
    private _loggersRepository: LoggerRepository;

    constructor() {
        super(new LoggerRepository())
        this._loggersRepository = new LoggerRepository();
    }
}


Object.seal(LoggerBusiness);
export = LoggerBusiness;