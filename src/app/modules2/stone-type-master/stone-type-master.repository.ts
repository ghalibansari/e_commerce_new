import {BaseRepository} from "../BaseRepository";
import stoneTypeMasterModel from "./stone-type-master.model";
import { IStoneTypeMaster } from "./stone-type-master.types";

export class StoneTypeMasterRepository extends BaseRepository<IStoneTypeMaster> {
    constructor () {
        super(stoneTypeMasterModel);
    }
    
    create = async (body: any): Promise<IStoneTypeMaster> => {
        let stoneType = await stoneTypeMasterModel.findOne({"type": body.type, isDeleted: false})
        if(stoneType) throw new Error("stoneType is already present")
        return await stoneTypeMasterModel.create(body)
    }

    update = async (body: any): Promise<IStoneTypeMaster> => {
        let stoneType = await stoneTypeMasterModel.findOne({"type": body.type, isDeleted: false})
        if(stoneType) throw new Error("stoneType is already present")
        //@ts-expect-error
        return await stoneTypeMasterModel.findOneAndUpdate({_id: body._id}, body, {new: true})
    }

}