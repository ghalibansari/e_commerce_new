import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { ICity } from "../city/city.types";

interface IBPinCode extends IBCommon {
    pincode_id: string
    area_name: string
    city_id: ICity['city_id']
    pincode: number
}

interface IPinCode extends Optional<IBPinCode, 'pincode_id'> { }

interface IMPinCode extends Model<IBPinCode, IPinCode>, IBPinCode, IMCommon { }

export { IPinCode, IMPinCode };

