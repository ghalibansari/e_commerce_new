import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IPincode } from "./pincodes.types";


export abstract class PincodeValidation extends BaseValidation {
    static addPincode(addPincode: any): import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> {
        throw new Error("Method not implemented.");
    }
    static readonly addPincodes = Joi.object<IPincode>({
        area_name: Joi.string().required(),
    });

    static readonly addPincodeBulk = Joi.array().items(this.addPincodes)

    static readonly editPincode = Joi.object<IPincode>({
        area_name: Joi.string(),
        is_active: Joi.boolean(),
    });
};