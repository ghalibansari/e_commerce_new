import {Document} from "mongoose";

export interface IAlertMaster extends Document {
    _id: string,
    code: string,
    description: string,
    priority: string,
    alertType: string,
    status: string
}