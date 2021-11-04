import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBStates extends IBCommon {
    state_id: string
    name: string
}

interface IStates extends Optional<IBStates, 'state_id'> { }

interface IMStates extends Model<IBStates, IStates>, IBStates, IMCommon { }

export { IStates, IMStates };

