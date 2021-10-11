import {BaseRepository} from "../BaseRepository";
import {IRapPrice} from "./rap-price.types";
import rapPriceModel from "./rap-price.model";
import {col} from "sequelize";


export class RapPriceRepository extends BaseRepository<IRapPrice> {
    constructor () {
        super(rapPriceModel);
    }

    filterCriteria = async (column: string[]): Promise<any> => {
        let face:{[x:string]: any[]} = {}, data:{[x:string]: string[]} = {}
        column.forEach(col => face[col] = [{$group: {_id: null, [col]: {$addToSet: `$${col}`}}}, {$unset: '_id'}])
        const [rapData] = await rapPriceModel.aggregate([{$facet: face}])
        column.forEach(col => data[col] = rapData[col][0][col])
        return data
    }
}