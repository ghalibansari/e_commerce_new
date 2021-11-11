import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";


export enum templateTypeEnum {
    email = 'email',
    sms = 'sms'
}

interface IBTemplate extends IBCommon {
    template_id: string;
    name: string
    to?: string[],
    cc?: string[],
    bcc?: string[],
    subject: string
    title: string
    body: string
    params: string[]
    type: templateTypeEnum
}

interface ITemplate extends Optional<IBTemplate, 'template_id'> { }

interface IMTemplate extends Model<IBTemplate, ITemplate>, IBTemplate, IMCommon { }

export { ITemplate, IMTemplate };
