import {IWeightRange} from "../../model/InfinityPriceCriteria";
import {IUser} from "../user/user.types";
import {Document} from "mongoose";
import {Moment} from 'moment'

export interface IRegisterDevice extends Document{
    _id: string;
    serialNumber: string;
    token: string;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

