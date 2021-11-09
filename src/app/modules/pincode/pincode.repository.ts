import { BaseRepository } from "../BaseRepository";
import { PinCodeMd } from "./pincode.model";
import { IMPinCode, IPinCode } from "./pincode.types";

export class PinCodeRepository extends BaseRepository<IPinCode, IMPinCode> {
    constructor() {
        super(PinCodeMd, 'pin_code_id', ['*'], ['created_at'], []);
    }
}