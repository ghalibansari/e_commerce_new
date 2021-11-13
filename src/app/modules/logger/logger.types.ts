import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBLogger extends IBCommon {
    logger_id: string;
    url?: string;
    method?: string;
    params?: string;
    query?: string;
    body?: string;
    module?: string;
    message: string;
    stack: string;
    level: loggerLevelEnum;
}

interface ILogger extends Optional<IBLogger, 'logger_id'> { }

export enum loggerLevelEnum {
    api = 'api',
    cron = 'cron',
    internal = 'internal',
    frontend = 'frontend'
}

interface IMLogger extends Model<IBLogger, ILogger>, IBLogger, IMCommon { }

export { ILogger, IMLogger };

