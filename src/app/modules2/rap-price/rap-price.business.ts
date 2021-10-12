import {BaseBusiness} from '../BaseBusiness'
import {IRapPrice, IShape, IShapeCode} from "./rap-price.types";
import {RapPriceRepository} from "./rap-price.repository";
import qs from "querystring";
import axios from "axios";


class RapPriceBusiness extends BaseBusiness<IRapPrice> {
    private _rapPriceRepository: RapPriceRepository;

    constructor() {
        super(new RapPriceRepository())
        this._rapPriceRepository = new RapPriceRepository();
    }

    fetch = async (shape: string, loggedInUserId: string = 'Cron'): Promise<IRapPrice[]|IRapPrice> => {     //Todo optimize it and condition to check whether rapPrice is already fetch or not, then only fetch if not fetch previously.
        let response, body, headers, dataToInsert: IRapPrice[] = []
        body = qs.stringify({ username:'soy10fchbfybbym60ssdyu7by7fjr9', password:'s0f9bgcD' }) //Todo remove this credentials from here
        headers = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
        response = await axios.post(`https://technet.rapaport.com:449/HTTP/Prices/CSV2_${shape}.aspx`, body, headers)
        response.data = JSON.stringify(response.data)
        response.data = response.data.split('\\r\\n').map((line:any) => line.split(','))
        await response.data.forEach(([shape, clarity, color, fromWeight, toWeight, price, effectiveDate]:string[]) => {
            if(shape && clarity && color && fromWeight && toWeight&& price && effectiveDate) {
                const date = effectiveDate.split('/')
                shape = shape.replace('"', '')
                shape = shape.replace('"\"', '')
                let shapeCode = shape
                if(shapeCode == IShapeCode.Round) shape = IShape.Round
                else if(shapeCode == IShapeCode.Pear) shape = IShape.Pear
                // else if(shapeCode == IShapeCode.Princess) shape = IShape.Princess
                // else if(shapeCode == IShapeCode.Marquise) shape = IShape.Marquise
                // else if(shapeCode == IShapeCode.Radiant) shape = IShape.Radiant
                // else if(shapeCode == IShapeCode.Heart) shape = IShape.Heart
                // else if(shapeCode == IShapeCode.Oval) shape = IShape.Oval
                // else if(shapeCode == IShapeCode.Cushion) shape = IShape.Cushion
                // else if(shapeCode == IShapeCode.Emerald) shape = IShape.Emerald
                // else if(shapeCode == IShapeCode.SEM_Square_Emerald_Cut) shape = IShape.SEM_Square_Emerald_Cut
                // else if(shapeCode == IShapeCode.EM_Emerald_Cut) shape = IShape.EM_Emerald_Cut
                // else if(shapeCode == IShapeCode.PB_Pear_Brilliant) shape = IShape.PB_Pear_Brilliant
                // else if(shapeCode == IShapeCode.OB_Oval_Brilliant) shape = IShape.OB_Oval_Brilliant
                // else if(shapeCode == IShapeCode.RBC_Round_Brilliant) shape = IShape.RBC_Round_Brilliant
                // console.log(effectiveDate);
                //@ts-expect-error
                dataToInsert.push({shape, shapeCode, clarity, color, weightRange: {fromWeight: parseFloat(fromWeight), toWeight: parseFloat(toWeight)}, price: parseFloat(price), effectiveDate: new Date(date[2], date[0]-1, date[1]), createdBy: loggedInUserId, updatedBy: loggedInUserId})
            }
        })
        return await this._rapPriceRepository.createBR(dataToInsert)    //Todo fix instead for inserting data one by one use insertMany mongoose function
    }
}


Object.seal(RapPriceBusiness);
export = RapPriceBusiness;