import { Model, Optional } from "sequelize";
import { IMUser } from "../user/user.types";

interface IBCategory {
    category_id: string
    name: string
    description: string
    status: boolean
    created_by: IMUser['user_id']
    updated_by: IMUser['user_id']
    deleted_by?: IMUser['user_id'] | null
}

interface ICategory extends Optional<IBCategory, 'category_id'> { }

interface IMCategory extends Model<IBCategory, ICategory>, IBCategory {
    deleted_by: IMUser['user_id'] | null
    created_on: Date;
    updated_on: Date;
    deleted_on: Date | null
}

export type { ICategory, IMCategory }