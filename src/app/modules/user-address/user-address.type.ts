import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IPinCode } from "../pincode/pincode.types";
import { IStates } from "../state/state.types";
import { IUser } from "../user/user.types";


interface IBUserAddress extends IBCommon {
    address_id: string
    user_id: IUser['user_id']
    is_default: boolean
    address_1: string
    address_2: string
    city: string
    state: IStates['state_id']
    pin_code: IPinCode['pin_code_id']
}

interface IUserAddress extends Optional<IBUserAddress, 'address_id'> { }

interface IMUserAddress extends Model<IBUserAddress, IBUserAddress>, IBUserAddress, IMCommon { }

export { IUserAddress, IMUserAddress };