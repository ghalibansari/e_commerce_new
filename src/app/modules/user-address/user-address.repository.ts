import { BaseRepository } from "../BaseRepository";
import { PinCodeMd } from "../pincode/pincode.model";
import { IUser } from "../user/user.types";
import { UserAddressMd } from "./user-address.model";
import { IMUserAddress, IUserAddress } from "./user-address.type";

export class UserAddressRepository extends BaseRepository<IUserAddress, IMUserAddress> {
    constructor() {
        super(UserAddressMd, 'address_id', ['address_1', 'address_2', 'city_id', 'state_id', 'pincode_id'], ['created_at'], []);
    }

    getShippingCharges = async ({user_id, address_id}: { user_id: IUser['user_id'], address_id: IUserAddress['address_id'] }): Promise<number> => {
        const include = [
            {
                model: PinCodeMd,
                as: "pincode",
                attributes: ["shipping_charges"],
                required: true,
                where: {is_active: true}
            },
        ];

        const attributes:any = ['pincode.shipping_charges'];
        const where: {user_id: IUser['user_id'], address_id?: IUserAddress['address_id'], is_default?: IUserAddress['is_default']} = {
            user_id
        };
        
        if(address_id){
            where.address_id = address_id;
        }
        else{
            where.is_default = true;
        }

        //@ts-expect-error
        const {shipping_charges} = await this.findOneBR({where, include, attributes, raw: true });

        return shipping_charges ?? 0;
    }
}