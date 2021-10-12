import {BaseRepository} from "../../../BaseRepository";
import fluorscenseMasterModel from "./fluorescense-master.model";
import { IFluorescenseMaster } from "./fluorescense-master.types";

export class FluorescenseMasterRepository extends BaseRepository<IFluorescenseMaster> {
    constructor () {
        super(fluorscenseMasterModel);
    }
    
    create = async (body: any): Promise<IFluorescenseMaster> => {
        let fluorescenseData = await fluorscenseMasterModel.findOne({"fluorescense": body.fluorescense, isDeleted: false})
        if(fluorescenseData) throw new Error("fluorescense is already present")
        return await fluorscenseMasterModel.create(body)
    }

    update = async (body: any): Promise<IFluorescenseMaster> => {
        let fluorescenseData = await fluorscenseMasterModel.findOne({"fluorescense": body.fluorescense, isDeleted: false})
        if(fluorescenseData) throw new Error("fluorescense is already present")
        //@ts-expect-error
        return await fluorscenseMasterModel.findOneAndUpdate({_id: body._id}, body, {new: true})
    }

}
