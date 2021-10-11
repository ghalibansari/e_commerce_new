import {BaseRepository} from "../BaseRepository";
import { IClientPrice } from "./client-price.types";
import clientPriceModel from "./client-price.model";
import {ISku, skuStoneStatusEnum} from "../sku/sku.types";
import skuModel from "../sku/sku.model";
import { IUser } from "../user/user.types";
import { ClientSession } from "mongoose";
import companyClientSettingModel from "../companyClientSetting/companyClientSetting.model";
import {iavStatusEnum, IIav} from "../iav/iav.types";
import iavModel from "../iav/iav.model";


export class ClientPriceRepository extends BaseRepository<IClientPrice> {
    constructor () {
        super(clientPriceModel);
    }

    create = async (skuIds: ISku['_id'][], price: number, user: IUser['_id']): Promise<void> => {   //Todo missing mongo session implementation.
        // let clientPriceData: IClientPrice[][] = [], iav: IIav[][] = [];
        let skuData = await skuModel.find({_id: {$in: skuIds}, isDeleted: false}); 
        skuData.map(async(sku:ISku) => {
            // let calcWeight: any = (sku.weight >= 5) ? 5 : (sku.weight).toFixed(2);
            let drv;let pwv = drv = price.toFixed(2);
            //@ts-expect-error
            let clientPriceObj: IClientPrice = {skuId: sku._id, companyId: sku.companyId, weight: Number(sku.weight), pwvImport: Number(sku.pwvImport),
                shape: sku.shape, color: sku.colorType, clarity: sku.clarity,price, createdBy: user, updatedBy: user
            };
            //@ts-ignore    //Todo remove-this-line-ts-ignore
            let clientPrice = await clientPriceModel.create([clientPriceObj]).then(data => data[0]);
            let iavObj = {skuId: sku._id, price, clientPriceId: clientPrice?._id, pwv , drv, status: "PENDING", createdBy: user, updatedBy: user};
            let iav = await iavModel.create([iavObj], {}).then(data => data[0])
            await skuModel.updateMany({_id: {$in: skuIds}},{stoneStatus: skuStoneStatusEnum.PRICE_CHANGED, iavId: iav._id, updatedBy: user});
        });
        // for (const sku of skuData) {
        //     let calcWeight: any = (sku.weight >= 5) ? 5 : (sku.weight).toFixed(2);
        //     let drv = Number(calcWeight * price).toFixed(2)
        //     let pwv = drv
        //     // clientPriceData.push({skuId: sku._id, companyId: sku.companyId, weight: sku.weight, pwvImport: sku.pwvImport,
        //     //     shape: sku.shape, color: sku.colorType, clarity: sku.clarity,price, createdBy: user, updatedBy: user
        //     // })
        //     let clientPriceObj = {skuId: sku._id, companyId: sku.companyId, weight: sku.weight, pwvImport: sku.pwvImport,
        //         shape: sku.shape, color: sku.colorType, clarity: sku.clarity,price, createdBy: user, updatedBy: user
        //     }
        //     //@ts-expect-error
        //     let iavObj = {skuId: sku._id, price, clientPriceId: clientPrice._id, pwv , drv, status: "PENDING", createdBy: user, updatedBy: user}
        //     //@ts-expect-error
        //     let clientPrice = await clientPriceModel.create([clientPriceObj], {session}).then(data => data[0])            
        //     // iav.push({skuId: sku._id, price, clientPriceId: clientPrice._id, pwv , drv, status: "PENDING", createdBy: user, updatedBy: user})
        // }
        // let [ sku, iavData] = await Promise.all([
        //     // await clientPriceModel.create(clientPriceData, {session}),
        //     await skuModel.updateMany({_id: {$in: skuIds}},{stoneStatus: "PRICE CHANGED", updatedBy: user}, {session}),
        //     //@ts-expect-error
        //     await iavModel.create(iav, {session})
        // ])
        // return sku  
        
    }

    update = async (body: any, user: IUser['_id']): Promise<IClientPrice|null> => {
        let skuData: ISku|null
        let clientPrice = await clientPriceModel.findOneAndUpdate({_id: body._id}, {status: body.status, updatedBy: user}, {new: true})
        if(body.status === "APPROVED"){
            let companyClientSetting = await companyClientSettingModel.findOne({companyId: clientPrice?.companyId}).select({"companyId":1, "diamondMatchRegistration": 1})
            if(companyClientSetting?.diamondMatchRegistration) await skuModel.findOneAndUpdate({_id: clientPrice?.skuId, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.APPROVED, stoneRegistration: true, updatedBy: user})
            else await skuModel.findOneAndUpdate({_id: clientPrice?.skuId, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.COLLATERAL_READY, stoneRegistration: false, updatedBy: user})
        }
        else skuData = await skuModel.findOneAndUpdate({_id: clientPrice?.skuId, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.REJECTED, updatedBy: user})
        await iavModel.updateMany({skuId: clientPrice?.skuId, clientPriceId: body._id}, {status: iavStatusEnum.APPROVED, updatedBy: user})
        return clientPrice
    }
}
