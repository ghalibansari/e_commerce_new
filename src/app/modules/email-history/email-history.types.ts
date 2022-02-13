import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBEmailHistory extends IBCommon {
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

interface IEmailHistory extends Optional<IBEmailHistory, "email_id"> { }

interface IMEmailHistory extends Model<IBEmailHistory, IEmailHistory>, IBEmailHistory, IMCommon { }

export { IEmailHistory, IMEmailHistory };

