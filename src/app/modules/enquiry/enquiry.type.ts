import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBContactUs extends IBCommon {
    enquiry_id: string
    name: string
    email: string
    contact_no: string
    message: string
}

interface IEnquiry extends Optional<IBContactUs, 'enquiry_id'> { }

interface IMEnquiry extends Model<IBContactUs, IEnquiry>, IBContactUs, IMCommon { }

export { IEnquiry, IMEnquiry };

