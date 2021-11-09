import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IPinCode } from "../pincode/pincode.types";
import { IProduct } from "../products/product.type";
import { IStates } from "../state/state.types";


interface IBOrderAddress extends IBCommon {
    order_product_id: string
    order_id: string
    address_1: string
    address_2: string
    city: string
    state: IStates['state_id']
    pin_code: IPinCode['pin_code_id']
}

interface IOrderAddress extends Optional<IBOrderAddress, 'order_product_id'> { }

interface IMOrderAddress extends Model<IBOrderAddress, IBOrderAddress>, IBOrderAddress, IMCommon { }

export { IOrderAddress, IMOrderAddress };
