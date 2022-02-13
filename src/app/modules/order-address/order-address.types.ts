import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IOrder } from "../orders/order.type";
import { IPinCode } from "../pincode/pincode.types";
import { IStates } from "../state/state.types";


interface IBOrderAddress extends IBCommon {
    order_address_id: string
    order_id: IOrder['order_id']
    address_1: string
    address_2: string
    city: string
    state: IStates['state_id']
    pin_code: IPinCode['pincode_id']
}

interface IOrderAddress extends Optional<IBOrderAddress, 'order_address_id'> { }

interface IMOrderAddress extends Model<IBOrderAddress, IBOrderAddress>, IBOrderAddress, IMCommon { }

export { IOrderAddress, IMOrderAddress };

