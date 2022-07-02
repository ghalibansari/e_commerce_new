import { BaseRepository } from "../BaseRepository";
import { OrderStatusMd } from "./order-status.model";
import { IMOrderStatus, IOrderStatus } from "./order-status.types";

export class OrderStatusRepository extends BaseRepository<IOrderStatus, IMOrderStatus> {
    constructor() {
        super(OrderStatusMd, 'status_id', ['*'], ['created_at'], []);
    }
}