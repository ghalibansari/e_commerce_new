import { IUser } from "../../../user/user.types";
import {Document, ObjectId} from "mongoose";
import {IColorRange} from "../color-range/color-range.types";
import {IColorMaster} from "../color-master/color-master.types";
import {IClarityMaster} from "../clarity-master/clarity-master.types";
import { ICaratMaster } from "../carat-master/carat-master.types";

export interface IInfinityPriceMaster extends Document {
    _id: ObjectId;
    caratRangeMasterId: ICaratMaster['_id'];
    colorMasterId: IColorMaster['_id'];
    clarityMasterId: IClarityMaster['_id'];
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}


export interface IInfinityPriceMasterNested extends Document {
    _id: ObjectId;
    caratRangeMasterId: ICaratMaster
    colorMasterId: IColorMaster
    clarityMasterId: IClarityMaster
    isActive:boolean;
    isDeleted:boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}