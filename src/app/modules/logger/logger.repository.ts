import { BaseRepository } from "../BaseRepository";
import { LoggerMd } from "./logger.model";
import { ILogger, IMLogger } from "./logger.types";

export class LoggerRepository extends BaseRepository<ILogger, IMLogger> {
    constructor() {
        super(LoggerMd, 'logger_id', ['*'], ['created_at'], []);
    }
}