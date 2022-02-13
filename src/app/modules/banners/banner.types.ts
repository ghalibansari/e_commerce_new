import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";


interface IBBanner extends IBCommon {
    banner_id: string;
    banner_text: string;
    order_sequence: number;
    show_on_home_screen?: boolean;
    banner_image: string;
    link_to: string;
    link_id: string;
}

interface IBanner extends Optional<IBBanner, 'banner_id'> { }

interface IMBanner extends Model<IBBanner, IBanner>, IBBanner, IMCommon { }

export { IBanner, IMBanner };

