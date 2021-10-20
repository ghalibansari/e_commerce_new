import { Model, Optional } from "sequelize";
import { IMUser } from "../user/user.types";

interface IBUnit {
    unit_id: string
    name: string
    short_name: string
    description: string
    status: boolean
    created_by: IMUser['user_id']
    updated_by: IMUser['user_id']
    deleted_by?: IMUser['user_id'] | null
}

interface IUnit extends Optional<IBUnit, 'unit_id'> { }

interface IMUnit extends Model<IBUnit, IUnit>, IBUnit {
    deleted_by: IMUser['user_id'] | null
    created_on: Date;
    updated_on: Date;
    deleted_on: Date | null
}

export type { IUnit, IMUnit }