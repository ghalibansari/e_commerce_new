import { BaseRepository } from "../BaseRepository";
import { OrderAddressMd } from "./order-address.model";
import { IMOrderAddress, IOrderAddress } from "./order-address.types";

export class OrderAddressRepository extends BaseRepository<IOrderAddress, IMOrderAddress> {
    constructor() {
        super(OrderAddressMd, 'order_address_id', [''], ['created_at'], []);
    }
}