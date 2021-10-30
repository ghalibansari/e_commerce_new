import { BaseRepository } from "../BaseRepository";
import { loggerMd } from "./logger.model";
import { ILogger, IMLogger } from "./logger.types";

export class LoggerRepository extends BaseRepository<ILogger, IMLogger> {
    constructor() {
        super(loggerMd, 'logger_id', ['*'], ['createdAt'], []);
    }
}