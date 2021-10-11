import {Document} from "mongoose";
import {IComment} from "../comment/comment.types";
import {ILab} from "../lab/lab.types";
import {ICompany} from "../company/company.types";
import {IUser} from "../user/user.types";
import {ActionType} from "../movement-activity/movement-activity.types";
import { IIav } from "../iav/iav.types";
import { IRfid } from "../rfid/rfid.types";
import { IDevice } from "../device/device.types";
import { ILoggedInUser } from "../baseTypes";
import { ISkuInfinityPrice } from "../sku-infinity-price/sku-infinity-price.types";


export interface ISku extends Document{
    _id: string;
    infinityRefId: string;
    dmGuid:string;
    reader: { serial : string; drawer : string }
    deviceId: IDevice['_id']|IDevice;
    isCollateral:boolean;
    infinityShape:string;
    clientShape:string;
    clientRefId: string;
    labShape:string;
    shape: string;
    labsId:ILab['_id'][];
    weight:number;
    movementStatus:ActionType;
    status : String;
    colorCategory:String;
    colorSubCategory:string;
    gradeReportColor:string;
    colorRapnet:string;
    clarity:string;
    cut:string;
    measurement:string;
    colorType:skuColorTypeEnum;
    comments:IComment[];
    companyId:ICompany['_id'];
    polish:string;
    tagId:string;
    symmetry:string;
    fluorescence: string;
    pwvImport: string;
    createdBy:IUser['_id'];
    updatedBy:IUser['_id'];
    createdAt:Date;
    updatedAt:Date;
    stoneRegistration:boolean;
    skuInfinityPriceId: ISkuInfinityPrice['_id']
    isActive:boolean
    isDeleted:boolean
    error: IErrorCond[];
    infinityPriceTotal: number;
    iavId: IIav['_id']
    rfId: IRfid['_id']|IRfid
    stoneStatus: skuStoneStatusEnum;
    rfIdStatus: skuRfIdStatusEnum;
    collateralStatus: skuCollateralStatusEnum;
    gemlogistStatus: skuGemlogistStatusEnum;    //Todo fix typo.
    dmStatus: skuDmStatusEnum
}

export enum skuStoneStatusEnum {
    ARRIVAL = 'ARRIVAL',
    /*PENDING_REVIEW = "PENDING REVIEW",*/
    TRANSIT = 'TRANSIT',
    CONSIGNMENT = 'CONSIGNMENT',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    MISSING = 'MISSING',
    SOLD = 'SOLD',
    REMOVED = 'REMOVED',
    PRICE_CHANGED = 'PRICE CHANGED',
    COLLATERAL_READY = 'COLLATERAL READY',
    REVIEW_AGAIN = "REVIEW AGAIN"
}

export enum skuRfIdStatusEnum {
    IN = 'IN',
    OUT = 'OUT',
    INSTOCK = 'INSTOCK',
    "" = ""
}

export enum skuCollateralStatusEnum {
    COLLATERAL_IN = 'COLLATERAL IN',
    COLLATERAL_OUT = 'COLLATERAL OUT',
    "" = ""
}

export enum skuColorTypeEnum  {
    WHITE = 'WHITE',
    OFF_WHITE='OFF-WHITE',
    FANCY='FANCY'
}

export interface IIavCond{
    weight: object;
    drv: object;
    iav: object;
    pwv: object;
}

export interface IErrorCond {
    code: string;
    description: string;
    createdBy: IUser['_id'];
    createdAt: Date
}

export enum skuGemlogistStatusEnum {
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
    NO_ACTION = 'NO ACTION',
    PRICE_CHANGE = 'PRICE CHANGE',
    DIAMONDMATCH_REQUIRED = 'DIAMONDMATCH REQUIRED' //Todo fix type
}

export enum skuDmStatusEnum {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    NOT_APPLICABLE = 'N/A'
}

export interface IReqChangeInfinityPrice {
    loggedInUser: ILoggedInUser;
    newData: {
        skuId: ISku['_id']
        price: number
    }[]
}