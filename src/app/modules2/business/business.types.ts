import {Document} from "mongoose";
import {IUser} from "../user/user.types"
import {IAlertMaster} from "../alert-master/alert-master.types"
import { ICompany } from "../company/company.types";
import { ISku } from "../sku/sku.types";
import { IEvent } from "../events/events.types";

export interface IBusiness extends Document {
    _id: string
    companyId: ICompany['_id'];
    action: [string];
    openSkuIds: ISku['_id'][];
    closeSkuIds: ISku['_id'][];
    lastOpenedAt: Date;
    lastClosedAt: Date;
    comments: string;
    lastOpenedBy:IUser['_id'];
    lastClosedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
    openColleteralCount: Number;
    openMissingCount: Number;
    openSoldCount: Number;
    closeColleteralCount: Number;
    closeMissingCount: Number;
    closeSoldCount: Number;    
}