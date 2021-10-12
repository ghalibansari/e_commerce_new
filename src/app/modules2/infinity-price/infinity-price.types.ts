import {Document, ObjectId} from "mongoose";
import {IShape, IShapeCode} from "../rap-price/rap-price.types";
import {IWeightRange} from "../../model/InfinityPriceCriteria";
import {IUser} from "../user/user.types";
import { ICaratMaster } from "./master/carat-master/carat-master.types";
import { IClarityRange } from "./master/clarity-range/clarity-range.types";
import { IColorRange } from "./master/color-range/color-range.types";
import {IStoneTypeMaster} from "../stone-type-master/stone-type-master.types";
import {IFluorescenseMaster} from "./master/fluorescense-master/fluorescense-master.types";

export interface IInfinityPrice extends Document {
    _id: ObjectId;
    // shape:IShape;
    // shapeCode:IShapeCode;
    stoneTypeId:IStoneTypeMaster['_id'];
    fluorescenseId:IFluorescenseMaster['_id'];
    clarityRangeId:IClarityRange['_id'];
    colorRangeId:IColorRange['_id'];
    weightRangeId: ICaratMaster['_id'];
    price:Number;
    effectiveDate:Date;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}
