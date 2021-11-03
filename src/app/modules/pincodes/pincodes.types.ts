import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBPincode extends IBCommon {
    pincode_id: string
    area_name: string
}

interface IPincode extends Optional<IBPincode, 'pincode_id'> { }

interface IMPincode extends Model<IBPincode, IPincode>, IBPincode, IMCommon { }

export type { IPincode, IMPincode };
