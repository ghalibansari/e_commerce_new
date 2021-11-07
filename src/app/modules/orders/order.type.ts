import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IUser } from "../user/user.types";

interface IBOrder extends IBCommon {
    order_id: string
    user_id: IUser['user_id']
    transaction_id: string
    grand_total: number
    shipping_charges: number
    status: string
}

interface IOrder extends Optional<IBOrder, 'order_id'> { }

interface IMOrder extends Model<IBOrder, IOrder>, IBOrder, IMCommon { }

export { IOrder, IMOrder };

