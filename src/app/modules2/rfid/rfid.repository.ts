import {BaseRepository} from "../BaseRepository";
import {IRfid} from "./rfid.types";
import rfidModel from "./rfid.model";
import skuModel from "../sku/sku.model";
import { IUser } from "../user/user.types";
import {ClientSession, ObjectId} from "mongoose";
import {ISku, skuStoneStatusEnum} from "../sku/sku.types";
import {ObjectID} from "bson";


export class RfidRepository extends BaseRepository<IRfid> {
    constructor () {
        super(rfidModel);
    }

    update = async (body: any, userId: IUser['_id'], session: ClientSession) : Promise<any> => {
        let skuId = await skuModel.findOne({_id: body.skuId}, '_id')
        if(!skuId?._id) throw new Error("Invalid SkuId")

        let [sku, rfid] = await Promise.all([
            await rfidModel.update({skuId: body.skuId, isActive: true}, {isActive: false, updatedBy: userId}, {session}),
            await rfidModel.create([{createdBy: userId, updatedBy: userId, ...body}], {session}).then(rfid => rfid[0])
        ])
        await skuModel.findOneAndUpdate({_id: body.skuId}, {rfId: rfid._id, updatedBy: userId}, {new: true, session})
        return rfid
    }

    rfidMapping = async (rfid: IRfid['rfid'], skuId: ISku['_id'], loggedInUserId: string) : Promise<any> => {
        let rfidData = await rfidModel.findOne({rfid})
        let skuData = await skuModel.findOne({_id: skuId})
        if(rfidData && skuData?.stoneStatus && [skuStoneStatusEnum.REMOVED, skuStoneStatusEnum.SOLD].includes(skuData?.stoneStatus)) {
            let rfid_id = new ObjectID()
          await rfidModel.insertMany([{_id: rfid_id, rfid, skuId, createdBy: loggedInUserId, updatedBy: loggedInUserId}])
            //@ts-expect-error
            await skuModel.updateOne({_id: skuId}, {rfId: rfid_id})
        }
        else throw new Error('Duplicated data.')
    }
}