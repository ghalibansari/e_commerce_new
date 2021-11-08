import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBCity extends IBCommon {
    city_id: string
    name: string
};

interface ICity extends Optional<IBCity, "city_id"> { }

interface IMCity extends Model<IBCity, ICity>, IBCity, IMCommon { }

export { ICity, IMCity };