import { BaseRepository } from "../BaseRepository";
import { OrderHistoryMd } from "./order-history.model";
import { IMOrderHistory, IOrderHistory } from "./order-history.type";

export class OrderHistoryRepository extends BaseRepository<IOrderHistory, IMOrderHistory> {
    constructor() {
        super(OrderHistoryMd, 'history_id', ['*'], [], []);
    }
}
