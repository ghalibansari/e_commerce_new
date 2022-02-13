import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IUser } from "../user/user.types";


interface IBUserAddress extends IBCommon {
    address_id: string
    user_id: IUser['user_id']
    is_default: boolean
    address_1: string
    address_2: string
    city: string
    state: string
    pin_code: string
}

interface IUserAddress extends Optional<IBUserAddress, 'address_id'> { }

interface IMUserAddress extends Model<IBUserAddress, IBUserAddress>, IBUserAddress, IMCommon { }

export { IUserAddress, IMUserAddress };

