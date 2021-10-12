import { Messages } from "../../../../constants";
import { IUser } from "../../../user/user.types";
import {BaseRepository} from "../../../BaseRepository";
import caratMasterModel from "./carat-master.model";
import { ICaratMaster } from "./carat-master.types";

export class CaratMasterRepository extends BaseRepository<ICaratMaster> {
    constructor () {
        super(caratMasterModel);
    }

    create = async (body: any, user: IUser['_id']) => {
        let existingRange: any = [], caratData: ICaratMaster[] = []

        const check = body.caratMaster.map(async (body: any) => {
            if (body.fromCarat < body.toCarat) {
                let facetData = await caratMasterModel.aggregate([
                    {
                        $facet: {
                            fromCarat: [{ $match: { fromCarat: { $lte: body.fromCarat }, toCarat: { $gte: body.fromCarat }, isDeleted: false } }, { $count: 'filterCount' }],
                            toCarat: [{ $match: { fromCarat: { $lte: body.toCarat }, toCarat: { $gte: body.toCarat }, isDeleted: false } }, { $count: 'filterCount' }]
                        }
                    }
                ]).then(data => {
                    let facetData: any = {};
                    facetData.fromCarat = (data[0]?.fromCarat[0]?.filterCount) ? data[0].fromCarat[0].filterCount : 0;
                    facetData.toCarat = (data[0]?.toCarat[0]?.filterCount) ? data[0].toCarat[0]?.filterCount : 0
                    return facetData
                })
                if(facetData.fromCarat !== 0 && facetData.toCarat !== 0) existingRange.push(body)
                // if (facetData.fromCarat === 0 || facetData.toCarat === 0) caratData.push(body)
                else {
                    body.createdBy = body.updatedBy = user
                    caratData.push(body)
                }
            }
        })
        await Promise.all(check)
        let data = await caratMasterModel.create(caratData)
        if(existingRange.length > 0) return {status: false, message: Messages.CARAT_RANGE_EXISTS, data: existingRange }
        else return {status: true, message: Messages.CREATE_SUCCESSFUL, data }


    }

}