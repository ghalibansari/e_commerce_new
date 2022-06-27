import { Errors } from "../../constants";
import { BaseRepository } from "../BaseRepository";
import { CityMd } from "../city/city.model";
import { PinCodeMd } from "../pincode/pincode.model";
import { StatesMd } from "../state/state.model";
import { IUser } from "../user/user.types";
import { UserAddressMd } from "./user-address.model";
import { IMUserAddress, IUserAddress } from "./user-address.type";
import { Transaction } from "sequelize/types";

export class UserAddressRepository extends BaseRepository<IUserAddress, IMUserAddress> {
    constructor() {
        super(UserAddressMd, 'address_id', ['address_1', 'address_2', 'city_id', 'state_id', 'pincode_id'], ['created_at'], []);
    }

    getShippingCharges = async ({ user_id, address_id }: { user_id: IUser['user_id'], address_id: IUserAddress['address_id'] }): Promise<number> => {
        const include = [
            {
                model: PinCodeMd,
                as: "pincode",
                attributes: ["shipping_charges"],
                required: true,
                where: { is_active: true }
            },
        ];

        const attributes: any = ['pincode.shipping_charges'];
        const where: { user_id: IUser['user_id'], address_id?: IUserAddress['address_id'], is_default?: IUserAddress['is_default'] } = {
            user_id
        };

        let check_shipping_address = false;
        if (address_id) {
            where.address_id = address_id;
            check_shipping_address = true;
        }
        else {
            where.is_default = true;
        }

        const addressData = await this.findOneBR({ where, include, attributes, raw: true });

        if (check_shipping_address && !addressData) {
            throw new Error(Errors.INVALID_ADDRESS)
        }

        // @ts-expect-error
        return addressData?.shipping_charges ?? 0;
    }

    fetchUserAddress = async ({ address_id, transaction }: { address_id: IMUserAddress['address_id'], transaction?: Transaction }): Promise<any> => {
        const address = await this.findByIdBR({ 
            id: address_id, 
            attributes: ["address_id", "is_default", "address_1", "address_2", "city_id", "state_id", "pincode_id"],
            include: [
              {
                model: CityMd,
                as: "city",
                attributes: ["name"]
              },
              {
                model: StatesMd,
                as: "state",
                attributes: ["name"]
              },
              {
                model: PinCodeMd,
                as: "pincode",
                attributes: ["pincode", "area_name"]
              }
            ],
            raw: false,
            transaction
          });
        
        return address;
    }
}