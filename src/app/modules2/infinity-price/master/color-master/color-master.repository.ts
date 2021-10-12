import { IUser } from "app/modules/user/user.types";
import {BaseRepository} from "../../../BaseRepository";
import colorMasterModel from "./color-master.model";
import { IColorMaster } from "./color-master.types";
import { Messages } from "../../../../constants";

export class ColorMasterRepository extends BaseRepository<IColorMaster> {
    constructor () {
        super(colorMasterModel);
    }

    create = async (body: any, user: IUser['_id']): Promise<any> => {
        let colorData: IColorMaster[] = [], existingColor: any =[]
        let count = await colorMasterModel.countDocuments()
        const check = body.color.map(async (color: IColorMaster['color'], i: number) => {
            let data = await colorMasterModel.findOne({ color, isDeleted: false });
            if(data) existingColor.push(color)

            else {
                //@ts-expect-error
                colorData.push({color, code: count + i + 1, createdBy: user, updatedBy: user});
            }
        })
        await Promise.all(check)
        let data = await colorMasterModel.create(colorData)
        if(existingColor.length > 0) return {status: false, message: Messages.COLOR_EXISTS, data: existingColor }
        else return {status: true, message: Messages.CREATE_SUCCESSFUL, data }

    }

}