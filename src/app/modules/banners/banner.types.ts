import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

//TODO: 
interface IBBanner extends IBCommon {
    banner_id: string;
    banner_text: string;
    order_sequence: number;
    show_on_homescreen: boolean;
    banner_image: string;
}

interface IBanner extends Optional<IBBanner, 'banner_id'> { }

interface IMBanner extends Model<IBBanner, IBanner>, IBBanner, IMCommon { }

export type { IBanner, IMBanner };

