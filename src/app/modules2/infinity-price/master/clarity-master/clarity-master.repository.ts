import { IUser } from "../../../user/user.types";
import {BaseRepository} from "../../../BaseRepository";
import clarityMasterModel from "./clarity-master.model";
import { IClarityMaster } from "./clarity-master.types";
import { Messages } from "../../../../constants";

export class ClarityMasterRepository extends BaseRepository<IClarityMaster> {
    constructor () {
        super(clarityMasterModel);
    }

    // create = async (body: any): Promise<IClarityMaster> => {
    //     let [clarityData, count] = await Promise.all([
    //         await clarityMasterModel.findOne({"clarity": body.clarity, isDeleted: false}),
    //         await clarityMasterModel.countDocuments()
    //     ])
    //     body.code = count + 1
    //     if(clarityData) throw new Error("clarity is already present")
    //     return await clarityMasterModel.create(body)
    // }

    create = async (body: any, user: IUser['_id']): Promise<any> => {
        let clarityData: IClarityMaster[] = [], existingClarity: any = []
        let count = await clarityMasterModel.countDocuments()
        const check = body.clarity.map(async (clarity: IClarityMaster['clarity'], i: number) => {
            let existingData = await clarityMasterModel.findOne({ clarity, isDeleted: false });
            console.log(existingData, "========checking");
            
            if(existingData) existingClarity.push(existingData)
            else {
                //@ts-expect-error
                clarityData.push({clarity, code: count + i + 1, createdBy: user, updatedBy: user});
            }
        })
        await Promise.all(check)        
        let data = await clarityMasterModel.create(clarityData)
        if(existingClarity.length > 0) return {status: false, message: Messages.CARAT_RANGE_EXISTS, data: existingClarity }
        else return {status: true, message: Messages.CREATE_SUCCESSFUL, data }

    }

    update = async (body: any): Promise<IClarityMaster> => {
        let clarityData = await clarityMasterModel.findOne({"clarity": body.clarity, isDeleted: false})
        if(clarityData) throw new Error("clarity is already present")
        //@ts-expect-error
        return await clarityMasterModel.findOneAndUpdate({_id: body._id}, body, {new: true})
    }

}