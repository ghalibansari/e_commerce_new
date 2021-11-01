import { Model, Optional } from "sequelize";
import { IMUser } from "../user/user.types";
// import { TemplateMd } from "./template.model";

interface IBTemplate {
    template_id: string;
    title: string
    slug: string
    subject: string
    body: string
    params: string
    type: number  //1=email,2=sms
    isActive: boolean
    isDeleted: boolean
    created_by: IMUser['user_id'];
    updated_by: IMUser['user_id'];
}
interface ITemplate extends Optional<IBTemplate, 'template_id'> { }

enum templateTypeEnum {
    one = 1,
    two = 2
}

interface IMTemplate extends Model<IBTemplate, ITemplate>, IBTemplate {
    deleted_by: IBTemplate['template_id'] | null
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date
}

export type { ITemplate, IMTemplate, templateTypeEnum }