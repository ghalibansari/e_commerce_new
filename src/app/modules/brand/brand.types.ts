import { Model, Optional } from "sequelize";
import { IMUser } from "../user/user.types";

interface IBBrand {
    brand_id: string
    name: string
    description: string
    status: boolean
    created_by: IMUser['user_id']
    updated_by: IMUser['user_id']
    deleted_by?: IMUser['user_id'] | null
}

interface IBrand extends Optional<IBBrand, 'brand_id'> { }

interface IMBrand extends Model<IBBrand, IBrand>, IBBrand {
    deleted_by: IMUser['user_id'] | null
    created_on: Date;
    updated_on: Date;
    deleted_on: Date | null
}

export type { IBrand, IMBrand }