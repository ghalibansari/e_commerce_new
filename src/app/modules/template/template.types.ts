import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";


export enum templateTypeEnum {
    one = 1,
    two = 2
}
interface IBTemplate extends IBCommon {
    template_id: string;
    title: string
    slug: string
    subject: string
    body: string
    params: string
    type: number  //1=email,2=sms
    isActive: boolean
    isDeleted: boolean
}
interface ITemplate extends Optional<IBTemplate, 'template_id'> { }

interface IMTemplate extends Model<IBTemplate, ITemplate>, IBTemplate, IMCommon { }

export type { ITemplate, IMTemplate };

