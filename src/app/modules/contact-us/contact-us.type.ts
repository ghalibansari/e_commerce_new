import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBContactUs extends IBCommon {
    contact_us_id: string
    name: string
    email: string
    contact_no: string
    message: string
}

interface IContactUs extends Optional<IBContactUs, 'contact_us_id'> { }

interface IMContactUs extends Model<IBContactUs, IContactUs>, IBContactUs, IMCommon { }

export { IContactUs,IMContactUs };
