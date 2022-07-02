import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";


interface IBOrderStatus extends IBCommon {
    status_id: string
    title: string
    description: string
    sequence: number
}

interface IOrderStatus extends Optional<IBOrderStatus, 'status_id'> { }

interface IMOrderStatus extends Model<IBOrderStatus, IBOrderStatus>, IBOrderStatus, IMCommon { }

export { IOrderStatus, IMOrderStatus };

