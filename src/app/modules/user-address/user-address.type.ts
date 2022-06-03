import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { ICity } from "../city/city.types";
import { IPinCode } from "../pincode/pincode.types";
import { IStates } from "../state/state.types";
import { IUser } from "../user/user.types";


interface IBUserAddress extends IBCommon {
    address_id: string
    user_id: IUser['user_id']
    is_default: boolean
    address_1: string
    address_2: string
    city_id: ICity['city_id']
    state_id: IStates['state_id']
    pincode_id: IPinCode['pincode_id']
}

interface IUserAddress extends Optional<IBUserAddress, 'address_id'> { }

interface IMUserAddress extends Model<IBUserAddress, IBUserAddress>, IBUserAddress, IMCommon { }

export { IUserAddress, IMUserAddress };

