import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IPinCode } from "./pincode.types";


export abstract class PinCodeValidation extends BaseValidation {
    static readonly addPinCodes = Joi.object<IPinCode>({
        area_name: Joi.string().required(),
    });

    static readonly addPinCodeBulk = Joi.array().items(this.addPinCodes)

    static readonly editPinCode = Joi.object<IPinCode>({
        area_name: Joi.string(),
        is_active: Joi.boolean(),
    });
};