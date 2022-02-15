import { BaseRepository } from "../BaseRepository";
import { OrderMd } from "./order.model";
import { IMOrder, IOrder } from "./order.type";

export class OrderRepository extends BaseRepository<IOrder, IMOrder> {
    constructor() {
        super(OrderMd, 'order_id', ['*'], ['grand_total'], []);
    }
}