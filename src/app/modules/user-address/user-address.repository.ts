import { BaseRepository } from "../BaseRepository";
import { UserAddressMd } from "./user-address.model";
import { IMUserAddress, IUserAddress } from "./user-address.type";

export class UserAddressRepository extends BaseRepository<IUserAddress, IMUserAddress> {
    constructor() {
        super(UserAddressMd, 'address_id', ['address_1', 'address_2', 'city_id', 'state_id', 'pincode_id'], ['created_at'], []);
    }
}