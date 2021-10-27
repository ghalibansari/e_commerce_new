import { Model, Optional } from "sequelize";
import { IMUser } from "../user/user.types";

interface IBLogger {
    logger_id: string;
    url: string;
    method: string;
    query: string;
    body: string;
    module: string;
    message: string;
    stack: string;
    level: loggerLevelEnum;
    created_by: IMUser['user_id']
    updated_by: IMUser['user_id']
    deleted_by?: IMUser['user_id'] | null
}

interface ILogger extends Optional<IBLogger, 'logger_id'> { }

export enum loggerLevelEnum {
    api = 'api',
    cron = 'cron',
    internal = 'internal',
    frontend = 'frontend'
}

interface IMLogger extends Model<IBLogger, ILogger>, IBLogger {
    deleted_by: IMUser['user_id'] | null
    created_on: Date;
    updated_on: Date;
    deleted_on: Date | null
}
export type { ILogger, IBLogger, IMLogger }