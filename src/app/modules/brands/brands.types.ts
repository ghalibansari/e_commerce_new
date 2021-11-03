import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";


interface IBBrands extends IBCommon {
    brand_id: string;
    brand_name: string;
    order_sequence: number;
    show_on_homescreen: boolean;
    banner_image: string;
}

interface IBrands extends Optional<IBBrands, 'brand_id'> { }

interface IMBrands extends Model<IBBrands, IBrands>, IBBrands, IMCommon { }

export type { IBrands, IMBrands };
1