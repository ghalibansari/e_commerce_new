import {IWeightRange} from "../../model/InfinityPriceCriteria";
import {IUser} from "../user/user.types";
import {Document} from "mongoose";
import {Moment} from 'moment'

export interface IRapPrice extends Document{
    _id: string;
    shape:IShape;
    shapeCode:IShapeCode;
    clarity:string;
    color:string;
    weightRange: IWeightRange;
    price:number;
    effectiveDate:Date;
    isActive: boolean;
    isDeleted: boolean;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
}

export enum IShape {
    Round = 'Round',
    Pear = 'Pear',
    Princess= 'Princess',
    Marquise = 'Marquise',
    Radiant = 'Radiant',
    Heart = 'Heart',
    Oval = 'Oval',
    Cushion = 'Cushion',
    Emerald = 'Emerald',
    SEM_Square_Emerald_Cut = 'SEM~Square Emerald Cut',
    EM_Emerald_Cut = 'EM~Emerald Cut',
    PB_Pear_Brilliant = 'PB~Pear Brilliant',
    OB_Oval_Brilliant = 'OB~Oval Brilliant',
    RBC_Round_Brilliant = 'RBC~Round Brilliant'
}

export enum IShapeCode {
    Round = 'BR',
    Pear = 'PS',
    Princess= 'Princess',
    Marquise = 'Marquise',
    Radiant = 'Radiant',
    Heart = 'Heart',
    Oval = 'Oval',
    Cushion = 'Cushion',
    Emerald = 'Emerald',
    SEM_Square_Emerald_Cut = 'SEM~Square Emerald Cut',
    EM_Emerald_Cut = 'EM~Emerald Cut',
    PB_Pear_Brilliant = 'PB~Pear Brilliant',
    OB_Oval_Brilliant = 'OB~Oval Brilliant',
    RBC_Round_Brilliant = 'RBC~Round Brilliant'
}