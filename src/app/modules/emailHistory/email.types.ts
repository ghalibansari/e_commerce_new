import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBEmail extends IBCommon {
    email_id: string;
    to: string;
    from: string;
    html: string;
    subject: string;
    cc?: string;
    error?: string;
    bcc?: string;
    attachment?: string,
    success: boolean
    result: string
};

interface IEmail extends Optional<IBEmail, "email_id"> { }

interface IMEmail extends Model<IBEmail, IEmail>, IBEmail, IMCommon { }

export { IEmail, IMEmail };

