import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBUnitMaster extends IBCommon {
    unit_id: string
    name: string
}

interface IUnitMaster extends Optional<IBUnitMaster, 'unit_id'> { }

interface IMUnitMaster extends Model<IBUnitMaster, IUnitMaster>, IBUnitMaster, IMCommon { }

export { IUnitMaster, IMUnitMaster };

