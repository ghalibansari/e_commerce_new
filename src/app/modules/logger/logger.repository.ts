import { IMLogger, loggerLevelEnum, IBLogger, ILogger } from "./logger.types";
import { loggerMd } from "./logger.model";
import { BaseRepository } from "../BaseRepository";

export class LoggerRepository extends BaseRepository<ILogger, IMLogger> {
    constructor() {
        super(loggerMd, 'logger_id', ['*'], [['created_on', 'DESC']], []);
    }
}