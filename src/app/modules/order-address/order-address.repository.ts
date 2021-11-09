import { BaseRepository } from "../BaseRepository";
import { OrderAddressMd} from "./order-address.model";
import {  IOrderAddress, IMOrderAddress  } from "./order-address.types";

export class OrderAddressRepository extends BaseRepository<IOrderAddress, IMOrderAddress> {
    constructor() {
        super(OrderAddressMd, 'order_product_id', ['*'], ['created_at'], []);
    }
}