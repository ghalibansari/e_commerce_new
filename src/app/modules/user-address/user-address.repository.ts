import { BaseRepository } from "../BaseRepository";
import { UserAddressMd} from "./user-address.model";
import {  IUserAddress, IMUserAddress  } from "./user-address.type";

export class UserAddressRepository extends BaseRepository<IUserAddress, IMUserAddress> {
    constructor() {
        super(UserAddressMd, 'address_id', ['*'], ['created_at'], []);
    }
}