import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { IStates } from "../state/state.types";

interface IBCity extends IBCommon {
    city_id: string
    name: string
    state_id: IStates['state_id']
};

interface ICity extends Optional<IBCity, "city_id"> { }

interface IMCity extends Model<IBCity, ICity>, IBCity, IMCommon { }

export { ICity, IMCity };
