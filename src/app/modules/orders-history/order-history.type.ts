import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IOrder } from "../orders/order.type";

interface IBOrderHistory extends IBCommon {
    history_id: string
    order_id: IOrder['order_id'],
    status_id: string
    comment: string
}

interface IOrderHistory extends Optional<IBOrderHistory, 'history_id'> { }

interface IMOrderHistory extends Model<IBOrderHistory, IOrderHistory>, IBOrderHistory, IMCommon { }

export { IOrderHistory, IMOrderHistory };

