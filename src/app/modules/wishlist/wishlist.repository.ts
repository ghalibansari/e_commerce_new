import { BaseRepository } from "../BaseRepository";
import { WishlistMd } from "./wishlist.model";
import { IWishlist, IMWishlist } from "./wishlist.type";

export class WishlistRepository extends BaseRepository<IWishlist, IMWishlist> {
    constructor() {
        super(WishlistMd, 'wishlist_id', ['*'], ['created_at'], []);
    }
}