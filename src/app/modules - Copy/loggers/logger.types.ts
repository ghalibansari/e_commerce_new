import {Document} from "mongoose";
import {IUser} from "../user/user.types";


export interface ILogger extends Document{
    _id: string;
    url: string;
    method: string;
    query: string;
    body: string;
    module: string;
    message: string;
    level: loggerLevelEnum;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

export enum loggerLevelEnum{
    api = 'api',
    cron = 'cron',
    internal = 'internal',
    frontend = 'frontend'
}

export interface ILoggerNested extends Document{
    _id: string;
    url: string;
    method: string;
    query: string;
    body: string;
    module: string;
    level: loggerLevelEnum;
    createdBy:IUser;
    updatedBy:IUser;
    createdAt:Date;
    updatedAt:Date;
}