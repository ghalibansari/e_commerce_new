import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBPinCode extends IBCommon {
    pin_code_id: string
    area_name: string
}

interface IPinCode extends Optional<IBPinCode, 'pin_code_id'> { }

interface IMPinCode extends Model<IBPinCode, IPinCode>, IBPinCode, IMCommon { }

export { IPinCode, IMPinCode };

