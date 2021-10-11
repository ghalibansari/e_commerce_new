import {BaseRepository} from "../BaseRepository";
import labMasterModel from "./lab-master.model";
import { ILabMaster } from "./lab-master.types";

export class LabMasterRepository extends BaseRepository<ILabMaster> {
    constructor () {
        super(labMasterModel);
    }
    
    create = async (body: any): Promise<ILabMaster> => {
        let labMaster = await labMasterModel.findOne({"labType": body.labType, isDeleted: false})
        if(labMaster) throw new Error("labType is already present")
        return await labMasterModel.create(body)
    }

    update = async (body: any): Promise<ILabMaster> => {
        let labMaster = await labMasterModel.findOne({"labType": body.labType, isDeleted: false})
        if(labMaster) throw new Error("labType is already present")
        //@ts-expect-error
        return await labMasterModel.findOneAndUpdate({_id: body._id}, body, {new: true})
    }

}