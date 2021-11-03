import { BaseRepository } from "../BaseRepository";
import { PincodeMd } from "./pincodes.model";
import { IMPincode, IPincode } from "./pincodes.types";

export class PincodeRepository extends BaseRepository<IPincode, IMPincode> {
    constructor() {
        super(PincodeMd, 'pincode_id', ['*'], ['created_at'], []);
    }
}